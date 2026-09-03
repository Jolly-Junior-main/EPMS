import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const provisionOrganization = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'SUPER_ADMIN') {
    throw new functions.https.HttpsError('permission-denied', 'Only Super Admins can provision organizations.');
  }

  const { orgData, buildingsCount, unitsPerBuilding } = data;
  if (!orgData || !orgData.primaryAdminEmail || !orgData.name) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required organization fields.');
  }

  const newOrgId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newSubId = `sub_${Date.now()}`;
  const adminEmail = orgData.primaryAdminEmail.trim().toLowerCase();
  const assignedPassword = orgData.tempPassword?.trim() || '123';
  const role = 'owner';

  try {
    // 1. Create the Auth User
    const userRecord = await admin.auth().createUser({
      email: adminEmail,
      password: assignedPassword,
      displayName: orgData.primaryAdminName,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: role,
      organizationId: newOrgId,
    });

    const batch = db.batch();

    // 2. Create User Document
    const userRef = db.collection('users').doc(userRecord.uid);
    batch.set(userRef, {
      uid: userRecord.uid,
      name: orgData.primaryAdminName || 'Admin User',
      email: adminEmail,
      role: role,
      phone: orgData.contactPhone || '',
      organizationId: newOrgId,
      organizationName: orgData.name,
      title: 'Managing Director • ' + orgData.name,
      createdAt: new Date().toISOString()
    });

    // 3. Create Organization Document
    const orgRef = db.collection('organizations').doc(newOrgId);
    const orgPayload = {
      ...orgData,
      organizationId: newOrgId,
      primaryAdminUid: userRecord.uid,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      usage: {
        buildingsCount: Math.max(1, buildingsCount || 1),
        unitsCount: Math.max(1, buildingsCount || 1) * Math.max(1, unitsPerBuilding || 8),
        usersCount: 1,
        storageBytes: 0
      }
    };
    batch.set(orgRef, orgPayload);

    // 4. Create Properties & Units
    const numBldgs = Math.max(1, buildingsCount || 1);
    const numUnits = Math.max(1, unitsPerBuilding || 8);
    
    for (let b = 1; b <= numBldgs; b++) {
      const bldgPropId = b === 1 ? `prop_${newOrgId}` : `prop_${newOrgId}_b${b}`;
      const bldgName = numBldgs === 1 ? (orgData.tradeName || orgData.name) : `${orgData.tradeName || orgData.name} - Building ${String.fromCharCode(64 + b)}`;
      
      batch.set(db.collection('properties').doc(bldgPropId), {
        propertyId: bldgPropId,
        organizationId: newOrgId,
        organizationName: orgData.name,
        name: bldgName,
        location: orgData.address || 'Addis Ababa, Ethiopia',
        totalUnits: numUnits,
        type: 'commercial'
      });

      const floorCount = Math.max(2, Math.ceil(numUnits / 2));
      let unitsCreated = 0;
      for (let f = 1; f <= floorCount; f++) {
        for (let u = 1; u <= 2; u++) {
          if (unitsCreated >= numUnits) break;
          unitsCreated++;
          const unitNum = numBldgs === 1 ? `U-${f}0${u}` : `B${b}-F${f}0${u}`;
          const unitId = `unit_${newOrgId}_b${b}_${f}0${u}`;
          const isOccupied = f === 1 && u === 1;

          batch.set(db.collection('units').doc(unitId), {
            unitId,
            organizationId: newOrgId,
            propertyId: bldgPropId,
            propertyName: bldgName,
            unitNumber: unitNum,
            floor: f,
            type: 'commercial_office',
            areaSqMeters: f === 1 ? 85 : 55,
            monthlyBaseRentETB: f === 1 ? 55000 : 38000,
            status: isOccupied ? 'occupied' : 'vacant'
          });
        }
      }
    }

    // 5. Create Subscription
    batch.set(db.collection('subscriptions').doc(newSubId), {
      subscriptionId: newSubId,
      organizationId: newOrgId,
      planId: orgData.planId || 'plan_prof',
      tier: orgData.planTier || 'professional',
      status: 'active',
      billingCycle: orgData.billingCycle || 'monthly',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true
    });

    await batch.commit();

    return { success: true, organizationId: newOrgId, uid: userRecord.uid };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
