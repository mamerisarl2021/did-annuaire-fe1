# admin dids list

URL: /api/superadmin/dids?page=1&page_size=20

Response :
{
"items": [
{
"did": "did:web:annuairedid-fe.qcdigitalhub.com:dirina:a5e4b82a-a079-409f-bb01-d11f8f6f22c3:s3",
"organization": "dirina",
"owner": "",
"document_type": "s3",
"status": "ACTIVE",
"latest_version": 3,
"created_at": "2026-02-18T11:26:11.030442+00:00"
},
{
"did": "did:web:annuairedid-fe.qcdigitalhub.com:ma-futuretail:06607d40-96bc-4b63-bc20-288fddce5c60:tegziuaip",
"organization": "ma-futuretail",
"owner": "",
"document_type": "tegziuaip",
"status": "DRAFT",
"latest_version": 1,
"created_at": "2026-02-18T11:12:50.105452+00:00"
},
{
"did": "did:web:annuairedid-fe.qcdigitalhub.com:ma-futuretail:06607d40-96bc-4b63-bc20-288fddce5c60:attestation",
"organization": "ma-futuretail",
"owner": "",
"document_type": "attestation",
"status": "ACTIVE",
"latest_version": 3,
"created_at": "2026-02-18T10:47:39.492546+00:00"
},
{
"did": "did:web:annuairedid-fe.qcdigitalhub.com:dirina:3b932c93-c3bc-4933-8d7d-8262ca6705cc:permis_conduite",
"organization": "dirina",
"owner": "",
"document_type": "permis_conduite",
"status": "ACTIVE",
"latest_version": 4,
"created_at": "2026-02-16T17:36:45.481995+00:00"
},
{
"did": "did:web:annuairedid-fe.qcdigitalhub.com:dirina:a5e4b82a-a079-409f-bb01-d11f8f6f22c3:attestation_fin_formation",
"organization": "dirina",
"owner": "",
"document_type": "attestation_fin_formation",
"status": "DEACTIVATED",
"latest_version": 3,
"created_at": "2026-02-16T17:22:43.661027+00:00"
}
],
"pagination": {
"count": 5,
"page": 1,
"page_size": 20,
"total_pages": 1,
"has_next": false,
"has_prev": false,
"next_page": null,
"prev_page": null,
"next_url": null,
"prev_url": null
}
}

# admin users list

URL : /api/superadmin/users?page=1&page_size=20

RESPONSE :

{
"items": [
{
"id": "be1f17b9-3d4c-4039-b449-ea794bacce6a",
"email": "icholamounibatou@gmail.com",
"first_name": "mouni",
"last_name": "ICHOLA",
"phone": "+22944936964",
"organization_id": "e95ad408-f361-45c2-a986-9f8be41ad70a",
"organization_name": "cheffe projet informatique",
"roles": [
"ORG_ADMIN"
],
"status": "PENDING",
"is_active": false,
"is_org_admin": true,
"created_at": "2026-02-18T11:34:45.038861+00:00",
"last_login": null
},
{
"id": "f02e8da4-d4ef-4941-9f38-ad8e8df05fa8",
"email": "akowakou251@gmail.com",
"first_name": "amour",
"last_name": "devakowakou",
"phone": "+2290158186569",
"organization_id": "f7290170-df0d-4b38-b033-9d73a47e466e",
"organization_name": "Ma futuretail",
"roles": [
"ORG_MEMBER",
"AUDITOR"
],
"status": "ACTIVE",
"is_active": true,
"is_org_admin": false,
"created_at": "2026-02-18T11:14:51.373249+00:00",
"last_login": "2026-02-18T11:21:44.429297+00:00"
},
{
"id": "06607d40-96bc-4b63-bc20-288fddce5c60",
"email": "strummer.arey@openmail.pro",
"first_name": "strummer",
"last_name": "openmail",
"phone": "+3348418525",
"organization_id": "f7290170-df0d-4b38-b033-9d73a47e466e",
"organization_name": "Ma futuretail",
"roles": [
"ORG_ADMIN"
],
"status": "ACTIVE",
"is_active": true,
"is_org_admin": true,
"created_at": "2026-02-18T10:27:02.024899+00:00",
"last_login": "2026-02-18T11:11:35.199468+00:00"
},
{
"id": "893adb4c-97f3-48fd-a15a-876d5c98ffbc",
"email": "fejebe4993@amiralty.com",
"first_name": "fejebe4993",
"last_name": "amiralty",
"phone": "+325655898979",
"organization_id": "95385b63-c694-466b-b13b-f7a341fd8914",
"organization_name": "MaCip",
"roles": [
"ORG_ADMIN"
],
"status": "ACTIVE",
"is_active": true,
"is_org_admin": true,
"created_at": "2026-02-18T08:14:39.753740+00:00",
"last_login": "2026-02-18T08:28:01.715236+00:00"
},
{
"id": "4d082f29-8f7d-4347-9e3e-9ccb19ad06a1",
"email": "icholmounibatou@gmail.com",
"first_name": "Mounibath",
"last_name": "ICHOLA",
"phone": "+229 0144936469",
"organization_id": "62611220-f01a-4b8a-b995-5fa290ac0885",
"organization_name": "Abi luxe",
"roles": [
"ORG_ADMIN"
],
"status": "PENDING",
"is_active": false,
"is_org_admin": true,
"created_at": "2026-02-17T09:12:36.211490+00:00",
"last_login": null
},
{
"id": "3b932c93-c3bc-4933-8d7d-8262ca6705cc",
"email": "vohak50042@bitonc.com",
"first_name": "GOOD",
"last_name": "Man",
"phone": "0143567862",
"organization_id": "a31121a0-85ef-463b-8f74-af56688d8ac2",
"organization_name": "DIRINA",
"roles": [
"ORG_MEMBER",
"AUDITOR"
],
"status": "ACTIVE",
"is_active": true,
"is_org_admin": false,
"created_at": "2026-02-16T17:33:38.688278+00:00",
"last_login": "2026-02-18T15:58:03.789615+00:00"
},
{
"id": "a5e4b82a-a079-409f-bb01-d11f8f6f22c3",
"email": "eleanya47@gmail.com",
"first_name": "john",
"last_name": "doe",
"phone": "+229 23456789",
"organization_id": "a31121a0-85ef-463b-8f74-af56688d8ac2",
"organization_name": "DIRINA",
"roles": [
"ORG_ADMIN"
],
"status": "ACTIVE",
"is_active": true,
"is_org_admin": true,
"created_at": "2026-02-16T17:17:36.724351+00:00",
"last_login": "2026-02-18T17:09:19.367832+00:00"
},
{
"id": "9d299a84-d080-4d53-a8db-2a6deec37829",
"email": "vodob79241@newtrea.com",
"first_name": "vodob79241",
"last_name": "newtrea",
"phone": "+501284848",
"organization_id": "4e99eb12-6554-4252-b179-001da1e7a4ac",
"organization_name": "Ministere des affaires etrangers",
"roles": [
"ORG_MEMBER",
"AUDITOR"
],
"status": "PENDING",
"is_active": false,
"is_org_admin": false,
"created_at": "2026-02-16T11:05:01.730272+00:00",
"last_login": null
},
{
"id": "e883a634-8299-4a3c-ab04-689be8bd57c2",
"email": "malik.tade@qualitycorporate.com",
"first_name": "Malik",
"last_name": "TADE",
"phone": "+2290165690646",
"organization_id": "167b8bd3-58c0-4e2b-b981-d29cb1171812",
"organization_name": "Quality Corporate",
"roles": [
"ORG_ADMIN"
],
"status": "INVITED",
"is_active": false,
"is_org_admin": true,
"created_at": "2026-02-13T17:21:18.309473+00:00",
"last_login": null
},
{
"id": "7669e3be-9429-4daa-947c-a0054714fb8b",
"email": "esthertolodou@gmail.com",
"first_name": "Esther",
"last_name": "TOLODOU",
"phone": "+2290197861680",
"organization_id": "6e91ea7d-94da-4520-934b-39c46cb15d66",
"organization_name": "HappyFood",
"roles": [
"ORG_ADMIN"
],
"status": "INVITED",
"is_active": false,
"is_org_admin": true,
"created_at": "2026-02-13T14:57:59.872643+00:00",
"last_login": null
},
{
"id": "f96b7c1f-8f46-46c4-94d2-3c84810e3d5d",
"email": "gloriatolodou@gmail.com",
"first_name": "Fifamè Esther Gloria",
"last_name": "TOLODOU",
"phone": "+2290197861680",
"organization_id": "3ab09d1a-290a-4e01-b052-02516ff7ad4d",
"organization_name": "FoodHappy",
"roles": [
"ORG_ADMIN"
],
"status": "INVITED",
"is_active": false,
"is_org_admin": true,
"created_at": "2026-02-13T13:58:44.671120+00:00",
"last_login": null
},
{
"id": "b166443d-3a0f-4bc2-9304-a9a0a216696a",
"email": "princedavealex.20@gmail.com",
"first_name": "Admin",
"last_name": "User",
"phone": "",
"organization_id": null,
"organization_name": null,
"roles": [],
"status": "ACTIVE",
"is_active": true,
"is_org_admin": false,
"created_at": "2026-02-10T12:32:01.106907+00:00",
"last_login": "2026-02-19T15:21:41.772039+00:00"
}
],
"pagination": {
"count": 12,
"page": 1,
"page_size": 20,
"total_pages": 1,
"has_next": false,
"has_prev": false,
"next_page": null,
"prev_page": null,
"next_url": null,
"prev_url": null
}
}

# admin publish request list

URL : /api/superadmin/publish-requests?page=1&page_size=20

RESPONSE :
{
"items": [
{
"id": "a3d07cd8-2f0e-4523-b0ad-e2450c661ef4",
"did": "did:web:annuairedid-fe.qcdigitalhub.com:dirina:3b932c93-c3bc-4933-8d7d-8262ca6705cc:permis_conduite",
"organization_id": "a31121a0-85ef-463b-8f74-af56688d8ac2",
"organization_name": "DIRINA",
"version": 1,
"status": "APPROVED",
"requested_by": "vohak50042@bitonc.com",
"decided_by": "eleanya47@gmail.com",
"decided_at": "2026-02-16T17:39:13.730828+00:00",
"note": null,
"created_at": "2026-02-16T17:37:27.017630+00:00"
}
],
"pagination": {
"count": 1,
"page": 1,
"page_size": 20,
"total_pages": 1,
"has_next": false,
"has_prev": false,
"next_page": null,
"prev_page": null,
"next_url": null,
"prev_url": null
}
}

# ADMIN DIDS STATS

URL : /api/superadmin/dids/stats

RESPONSE :
{
"success": true,
"message": "DID statistics",
"data": {
"total": 5,
"by_status": {
"active": 3,
"deactivated": 1,
"draft": 1
},
"by_environment": {
"prod": 4,
"draft": 6
},
"publish_requests": {
"approved": 1
},
"top_organizations": [
{
"id": "a31121a0-85ef-463b-8f74-af56688d8ac2",
"name": "DIRINA",
"count": 3
},
{
"id": "f7290170-df0d-4b38-b033-9d73a47e466e",
"name": "Ma futuretail",
"count": 2
}
],
"by_organization": [
{
"id": "a31121a0-85ef-463b-8f74-af56688d8ac2",
"name": "DIRINA",
"total": 3,
"active": 2,
"deactivated": 1
},
{
"id": "f7290170-df0d-4b38-b033-9d73a47e466e",
"name": "Ma futuretail",
"total": 2,
"active": 1,
"draft": 1
}
]
},
"extra": {},
"errors": null,
"code": null,
"request_id": ""
}
