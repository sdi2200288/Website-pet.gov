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

lostReports, foundReports = {
    id  
    petId  
    date
    region
    address
    condition
    status // 'draft' ή 'submitted'
    ownerId  // το ποιος την υπέβαλε (οχι απαραίτητα ο ιδιοκτήτης)
    createdAt
    photoUrl
},

foundReportsWithoutAcc = {
    id
    petId 
    date
    region
    address
    condition
    status
    createdAt
    photoUrl
    firstname
    lastname
    email
    phone
}


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
    duration
    startTime
    endTime
    type
    actionCode
    weight: 
    anesthesia
    description
    medications
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

reviews = {
    id
    vetId
    ownerId
    appointmentId
    stars
    text
    createdAt
}


