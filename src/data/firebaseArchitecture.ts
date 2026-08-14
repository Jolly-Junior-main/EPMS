export const FIRESTORE_SECURITY_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Custom Claims Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    function isOwner() {
      return isAuthenticated() && (getUserRole() == 'owner' || isAdmin());
    }
    
    function isManager() {
      return isAuthenticated() && (getUserRole() == 'manager' || isOwner());
    }

    // ==========================================
    // 1. TENANTS & DOCUMENTS
    // Manager & Owner have operational CRUD
    // ==========================================
    match /tenants/{tenantId} {
      allow read: if isManager();
      allow create, update: if isManager();
      allow delete: if isOwner();

      match /documents/{docId} {
        allow read: if isManager();
        allow write: if isManager();
      }
    }

    // ==========================================
    // 2. INVOICES
    // Managers create/update invoices.
    // Payment status transitions to 'paid' require Owner verification.
    // ==========================================
    match /invoices/{invoiceId} {
      allow read: if isManager();
      allow create: if isManager();
      allow update: if isManager() && (
        // Managers can update general fields or set submitted_for_verification
        (request.resource.data.paymentStatus != 'paid') ||
        // Only Owners/Admins can mark invoices as 'paid'
        isOwner()
      );
      allow delete: if isOwner();
    }

    // ==========================================
    // 3. PAYMENTS & RECEIPT AUDIT
    // Managers log payments (unverified).
    // ONLY Owners/Admins can verify/reject payments.
    // ==========================================
    match /payments/{paymentId} {
      allow read: if isManager();
      allow create: if isManager() && request.resource.data.verificationStatus == 'unverified';
      
      // Update rule: Only Owner can modify verificationStatus (verified / rejected)
      allow update: if isOwner() && (
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['verificationStatus', 'verifiedBy', 'verifiedAt', 'rejectionReason', 'notes'])
      );
      allow delete: if isAdmin();
    }

    // ==========================================
    // 4. REVENUE AGGREGATES & THE RED LIST
    // Owner & Admin exclusive analytics
    // ==========================================
    match /analytics/{docId} {
      allow read: if isOwner();
      allow write: if false; // Managed solely via Cloud Functions triggers
    }

    // ==========================================
    // 5. SMS DISPATCH LOGS
    // ==========================================
    match /sms_logs/{logId} {
      allow read: if isManager();
      allow write: if isAdmin(); // Written by Cloud Function scheduler
    }
    
    match /units/{unitId} {
      allow read: if isManager();
      allow write: if isOwner();
    }
  }
}
`;

export const FIREBASE_STORAGE_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isManager() {
      return request.auth != null && 
        (request.auth.token.role in ['manager', 'owner', 'admin']);
    }
    
    function isOwner() {
      return request.auth != null && 
        (request.auth.token.role in ['owner', 'admin']);
    }

    // Tenant documents (PDF, Docx, Image <= 25MB)
    match /tenants/{tenantId}/documents/{fileName} {
      allow read: if isManager();
      allow write: if isManager() 
        && request.resource.size < 25 * 1024 * 1024
        && request.resource.contentType.matches('application/pdf|image/.*');
    }

    // Bank Payment Receipts (Image/PDF <= 10MB)
    match /receipts/{receiptId} {
      allow read: if isManager();
      allow write: if isManager() 
        && request.resource.size < 10 * 1024 * 1024
        && request.resource.contentType.matches('image/.*|application/pdf');
    }
  }
}
`;

export const CLOUD_FUNCTIONS_V2_SMS_CODE = `/**
 * Firebase Cloud Functions v2 - Automated SMS Reminder Engine
 * Trigger: onSchedule('every day 08:00')
 * Timezone: Africa/Addis_Ababa
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from "axios";

const db = getFirestore();

export const dailyRentReminderEngine = onSchedule({
  schedule: "every day 08:00",
  timeZone: "Africa/Addis_Ababa",
  memory: "512MiB",
  timeoutSeconds: 300
}, async (event) => {
  const now = new Date();
  
  // Calculate today bounds
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  // Calculate 7 days ahead bounds
  const in7DaysDate = new Date(now);
  in7DaysDate.setDate(now.getDate() + 7);
  const startOf7Days = new Date(in7DaysDate.getFullYear(), in7DaysDate.getMonth(), in7DaysDate.getDate(), 0, 0, 0);
  const endOf7Days = new Date(in7DaysDate.getFullYear(), in7DaysDate.getMonth(), in7DaysDate.getDate(), 23, 59, 59);

  console.log(\`[SMS Engine] Executing daily cycle for \${now.toISOString()}\`);

  // -------------------------------------------------------------
  // QUERY 1: Invoices due in 7 days (paymentStatus != 'paid')
  // -------------------------------------------------------------
  const query7Days = await db.collection("invoices")
    .where("dueDate", ">=", Timestamp.fromDate(startOf7Days))
    .where("dueDate", "<=", Timestamp.fromDate(endOf7Days))
    .where("paymentStatus", "in", ["pending", "submitted_for_verification", "delinquent"])
    .get();

  for (const doc of query7Days.docs) {
    const invoice = doc.data();
    const tenantDoc = await db.collection("tenants").doc(invoice.tenantId).get();
    if (!tenantDoc.exists) continue;
    const tenant = tenantDoc.data();

    const unitDoc = await db.collection("units").doc(invoice.unitId).get();
    const unitNumber = unitDoc.exists ? unitDoc.data().unitNumber : "Unit";

    const formattedAmount = Number(invoice.amountDue).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const formattedDueDate = new Date(invoice.dueDate.toDate()).toLocaleDateString('en-CA');

    const message = \`Dear \${tenant.legalName}, this is a friendly reminder from management that your rent for \${unitNumber} is due in 7 days on \${formattedDueDate}. Amount Due: \${formattedAmount} ETB. Thank you.\`;

    await dispatchSMS({
      to: tenant.phone,
      tenantName: tenant.legalName,
      tenantId: invoice.tenantId,
      unitNumber: unitNumber,
      invoiceId: doc.id,
      amountETB: invoice.amountDue,
      dueDate: formattedDueDate,
      messageType: '7_day_reminder',
      messageText: message
    });
  }

  // -------------------------------------------------------------
  // QUERY 2: Invoices due TODAY (paymentStatus != 'paid')
  // -------------------------------------------------------------
  const queryToday = await db.collection("invoices")
    .where("dueDate", ">=", Timestamp.fromDate(startOfToday))
    .where("dueDate", "<=", Timestamp.fromDate(endOfToday))
    .where("paymentStatus", "in", ["pending", "submitted_for_verification", "delinquent"])
    .get();

  for (const doc of queryToday.docs) {
    const invoice = doc.data();
    const tenantDoc = await db.collection("tenants").doc(invoice.tenantId).get();
    if (!tenantDoc.exists) continue;
    const tenant = tenantDoc.data();

    const unitDoc = await db.collection("units").doc(invoice.unitId).get();
    const unitNumber = unitDoc.exists ? unitDoc.data().unitNumber : "Unit";

    const formattedAmount = Number(invoice.amountDue).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const formattedDueDate = new Date(invoice.dueDate.toDate()).toLocaleDateString('en-CA');

    const message = \`Dear \${tenant.legalName}, your rent for \${unitNumber} is due today, \${formattedDueDate}. Please clear the balance of \${formattedAmount} ETB to prevent account delinquency and late fees.\`;

    await dispatchSMS({
      to: tenant.phone,
      tenantName: tenant.legalName,
      tenantId: invoice.tenantId,
      unitNumber: unitNumber,
      invoiceId: doc.id,
      amountETB: invoice.amountDue,
      dueDate: formattedDueDate,
      messageType: 'due_today_reminder',
      messageText: message
    });
  }
});

async function dispatchSMS(payload) {
  // Transmit payload via HTTP REST SMS gateway (Twilio / EthioTelecom REST API)
  const response = await axios.post("https://api.gateway.et/v1/sms/send", {
    senderId: "BOLE-PLAZA",
    recipient: payload.to,
    message: payload.messageText
  }, {
    headers: { Authorization: \`Bearer \${process.env.SMS_GATEWAY_TOKEN}\` }
  });

  // Record audit log in Firestore
  await db.collection("sms_logs").add({
    ...payload,
    gateway: "EthioTelecom_REST",
    status: response.status === 200 ? "delivered" : "sent",
    dispatchedAt: new Date().toISOString(),
    httpStatusCode: response.status,
    gatewayMessageId: response.data.messageId || "GATEWAY-" + Date.now()
  });
}
`;
