_________________________________________________________________________________________________________________________________________________________

MΕΛΗ

Αλτάνη-Δάφνη Τόντου    1115 2022 00288
Ελένη Αντωνίου         1115 2022 00006

_________________________________________________________________________________________________________________________________________________________

ΤΙ ΕΧΟΥΜΕ ΥΛΟΠΟΙΉΣΕΙ

Έχουμε υλοποιήσει όλα τα ζητούμενα εκτός απο την επεξεργασία των δηλώσεων υιοθεσίας, αναδοχής και μεταβίβασης του Κτηνιάτρου οταν είναι σε 
κατάσταση προσωρινής αποθήκευσης, μιας και η κυρία Κολοβού είπε στο feedback οτι δεν ειναι απαραίτητο να υλοποιήσουμε αυτους τους 3 τύπους δηλώσεων.
Επίσης δεν έχουμε υλοποιήσει να ανεβαίνουν εικόνες στη ΒΔ αν και στις δηλώσεις ο χρήστης  μπορεί να επιλέξει κάποια φωτογραφία απο τον υπολογιστή (ρωτήσαμε και την κυρία Κολοβού στο feedback και είπε οτι είναι οκ). 
Τέλος στο ξεχάσατε τον κωδικό σας δεν αποστέλεται κάποιο email, απλα ψάχνει το email αν το βρει βγάζει μήνυμα οτι έγινε η αποστολή email αλλιως 
βγάζει μήνυμα μη ύπαρξης λογαριασμού με αυτο το ΑΦΜ στην ΒΔ.

_________________________________________________________________________________________________________________________________________________________

ΔΟΚΙΜΑΣΤΙΚΟΙ ΚΩΔΙΚΟΊ

Owners = [
    {
        EMAIL = sdi2200288@uoa.gr
        PASSWORD = Altani1!!!
    }
]

Vets = [
    {
        EMAIL = vetgiorgos@example.com
        PASSWORD = Vet1!!
    },
    {
        EMAIL = e.antoniou@gmail.com
        PASSWORD = 123456789
    }
]
 
_________________________________________________________________________________________________________________________________________________________

ΣΎΝΔΕΣΜΟΣ GITHUB 

HTTPS =  https://github.com/sdi2200006/lab1.git
SSH = git@github.com:sdi2200006/lab1.git

_________________________________________________________________________________________________________________________________________________________

ΜΟΡΦΗ ΒΔ

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
    specializations []
    region
    studyLevel
    experience
    photoUrl
    services []
    schedule []
    availability []
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

adoptionReports ={
    id
    petId
    vetId
    currentOwnerId
    newOwnerId
    adoptionDate
    status
    createdAt
}

fosterReports = { 
    id
    petId
    vetId
    currentOwnerId
    fosterOwnerId
    fosterDate
    status
    createdAt
}

transferReports = {
    id
    petId
    vetId
    currentOwnerId
    newOwnerId
    transferDate
    status
    createdAt
}

medicalReports = {
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
    status = "submitted"
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
    id
    userId
    userType
    title
    message
    appointmentId
    read
    createdAt
}


identity= {
    id
    petId
    vetId
    ownerId
    date
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

_________________________________________________________________________________________________________________________________________________________

