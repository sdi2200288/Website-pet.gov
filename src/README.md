Owners = {
    id
    firstname 
    lastname 
    afm 
    gender 
    address 
    birthdate 
    phone 
    email 
    password 
}

Vets={
    id
    firstname
    lastname
    afm
    gender
    birthdate
    email
    address
    phone
    password
    specializations
    region
    studyLevel
    experience
    photoUrl
    services
    schedule
    availability
    totalScore
    reviewCount
}

Pets={
    id
    ownerId
    name
    species
    breed
    gender
    microchip
    birthdate
    age
    region
    lastSeenAddress
    lastSeenDate
    condition
    status
    photoUrl
    lost
}

lostReports= {
    id
    petId
    date
    region
    address
    condition
    status
    ownerId
    createdAt
},


 adoptionReports, fosterReports = {
    id
    petId
    vetId
    status
    createdAt
}

transferReports ={
    id
    petId
    vetId
    newOwnerId
    currentOwnerId
    status
    createdAt
}

medicalReports=    {
    id
    petId
    vetId
    date
    type
    description
    medications
    status
    createdAt
}

appointments = {
    id
    vetId
    petId
    date
    time
    reason
    description
    status
    createdAt
    ownerId
    cancelledBy null
    cancelledAt null
}

notifications={
    id: 4155,
    userId: o102,
    userType: owner,
    title: Επιβεβαίωση Ραντεβού,
    message: Ο κτηνίατρος ΓΙΩΡΓΟΣ ΚΩΝΣΤΑΝΤΙΝΟΥ επιβεβαίωσε το ραντεβού για Σούζυ στις 2026-01-21 10:30,
    appointmentId: app_08eniqgxl,
    read: false,
    createdAt: 2026-01-07T19:06:29.401Z
}


identity= {
    id: idnqad0xm55x,
    petId: vp2zapvcwhj,
    vetId: v001,
    date: 2026-01-10
}

reviews=    {
    id: a018,
    vetId: v202,
    ownerId: 631b,
    appointmentId: app_1o5yua48j,
    stars: 3,
    text: Ολα καλα!,
    createdAt: 2026-01-12T15:19:48.076Z
}