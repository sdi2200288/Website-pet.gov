import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { REGIONS } from "../Utils/Util";
import "../OwnerDashboard/PetReport.css";


export default function FoundLost({ isLoggedIn, userData }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [pet, setPet] = useState(null);
    const [errors, setErrors] = useState({});
    const [isPetOwner, setIsPetOwner] = useState(false);

    const handleFoundChange = (field, value) => {
        setFoundInfo({ ...foundInfo, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const validateStep1 = () => {
        if (isLoggedIn) return true;
        const newErrors = {};
        if (!formUser.firstname.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
        if (!formUser.lastname.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
        if (formUser.firstname.trim() && !/^[Α-ΩA-Z]+$/.test(formUser.firstname.trim())) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
        if (formUser.lastname.trim() && !/^[Α-ΩA-Z]+$/.test(formUser.lastname.trim())) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
        if (!formUser.phone.trim() && !formUser.email.trim()) {
            newErrors.phone = "Πρέπει να συμπληρώσετε τηλέφωνο ή email";
            newErrors.email = "Πρέπει να συμπληρώσετε τηλέφωνο ή email";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!foundInfo.date) newErrors.date = "Πρέπει να επιλέξετε ημερομηνία";
        if (!foundInfo.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";

        if (foundInfo.date && pet?.lastSeenDate) {
            const foundDate = new Date(foundInfo.date);
            const lastSeenDate = new Date(pet.lastSeenDate);
            if (foundDate < lastSeenDate) {
                newErrors.date = "Η ημερομηνία πρέπει να είναι μετά την τελευταία εξαφάνιση του κατοικιδίου";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [formUser, setFormUser] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
    });

    const [foundInfo, setFoundInfo] = useState({
        date: "",
        region: "",
        address: "",
        condition: "",
    });

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`http://localhost:3001/pets/${id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (!data.lost) throw new Error();
                setPet(data);
                // if (isLoggedIn && userData?.id && data?.ownerId) {
                //     setIsPetOwner(String(userData.id) === String(data.ownerId));
                // } else {
                //     setIsPetOwner(false);
                // } (data);
                setPet(data);

                const ownerMatch =
                    isLoggedIn && userData?.id != null && data?.ownerId != null
                        ? String(userData.id) === String(data.ownerId)
                        : false;

                setIsPetOwner(ownerMatch);


            } catch {
                alert("Το κατοικίδιο δεν βρέθηκε");
                navigate("/all-lost-pets");
            }
        };
        fetchPet();
    }, [id, navigate, isLoggedIn, userData?.id]);

    useEffect(() => {
        if (isLoggedIn && userData) {
            setFormUser({
                firstname: userData.firstname,
                lastname: userData.lastname,
                phone: userData.phone,
                email: userData.email,
            });
        }
    }, [isLoggedIn, userData]);

    const handleUserChange = (field, value) => {
        if (isLoggedIn) return;
        setFormUser({ ...formUser, [field]: value });
        if (field === "phone" || field === "email") {
            setErrors({ ...errors, phone: "", email: "" });
        } else {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const handleCancel = () => {
        const confirmLeave = window.confirm(
            "Αν φύγετε, τα στοιχεία δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να φύγετε;"
        );
        if (confirmLeave) {
            navigate(`/all-lost-pets/PetProfile/${pet.id}`);
        }
    };

    const handleSubmit = async (status) => {
        if (isLoggedIn && String(userData?.id) === String(pet?.ownerId)) {
            alert("Δεν μπορείτε να κάνετε δήλωση εύρεσης για το δικό σας κατοικίδιο.");
            return;
        }


        const common = {
            petId: pet.id,
            date: foundInfo.date,
            region: foundInfo.region,
            address: foundInfo.address,
            condition: foundInfo.condition,
            status, // 'draft' ή 'submitted'
            createdAt: new Date().toISOString(),
            photoUrl: pet.photoUrl || "",
        };

        const url = isLoggedIn ? "http://localhost:3001/foundReports" : "http://localhost:3001/foundReportsWithoutAcc";
        const rep = isLoggedIn ? { ...common, ownerId: userData.id, } : { ...common, firstname: formUser.firstname, lastname: formUser.lastname, email: formUser.email, phone: formUser.phone, };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rep),
            });
            if (!res.ok) throw new Error();
            alert(status === "draft" ? "Η δήλωση αποθηκεύτηκε προσωρινά." : "Η δήλωση υποβλήθηκε οριστικά!");
            navigate(`/all-lost-pets/PetProfile/${pet.id}`);
        } catch {
            alert("Σφάλμα κατά την υποβολή");
        }
    };


    if (!pet) return null;

    /* ================= STEPPER ================= */
    const Stepper = () => (
        <div className="stepper">
            <div
                className={`step ${step === 1 ? "active" : step > 1 ? "clickable" : ""}`}
                onClick={() => step > 1 && setStep(1)}>
                <div className="circle">1</div>
                <div className="step-title">Προσωπικά Στοιχεία</div>
            </div>
            <div className="line" />
            <div
                className={`step ${step === 2 ? "active" : step > 2 ? "clickable" : ""}`}
                onClick={() => step > 2 && setStep(2)}>
                <div className="circle">2</div>
                <div className="step-title">Στοιχεία Εύρεσης</div>
            </div>
            <div className="line" />
            <div className={`step ${step === 3 ? "active" : ""}`}>
                <div className="circle">3</div>
                <div className="step-title">Προεπισκόπηση και Υποβολή</div>
            </div>
        </div>
    );

    return (
        <div className="report-container">
            <Stepper />
            {/* ================= STEP 1 ================= */}
            {step === 1 && (
                <div className="found-form">
                    <h3>Προσωπικά Στοιχεία</h3>
                    <label>
                        Όνομα: πχ ΜΑΡΙΑ με κεφαλαία *
                        <input
                            type="text"
                            className={errors.firstname ? "inputError" : ""}
                            value={formUser.firstname}
                            disabled={isLoggedIn}
                            onChange={(e) => handleUserChange("firstname", e.target.value)}
                        />
                        {errors.firstname && (
                            <div className="fieldError">{errors.firstname}</div>
                        )}
                    </label>

                    <label>
                        Επώνυμο: πχ ΑΝΤΩΝΙΟΥ με κεφαλαία *
                        <input
                            type="text"
                            className={errors.lastname ? "inputError" : ""}
                            value={formUser.lastname}
                            disabled={isLoggedIn}
                            onChange={(e) => handleUserChange("lastname", e.target.value)}
                        />
                        {errors.lastname && (
                            <div className="fieldError">{errors.lastname}</div>
                        )}
                    </label>

                    <label>
                        Τηλέφωνο *
                        <input
                            type="text"
                            className={errors.phone ? "inputError" : ""}
                            value={formUser.phone}
                            disabled={isLoggedIn}
                            maxLength={15}
                            onChange={(e) => handleUserChange("phone", e.target.value)}
                        />
                        {errors.phone && (
                            <div className="fieldError">{errors.phone}</div>
                        )}
                    </label>

                    <label>
                        Email *
                        <input
                            type="email"
                            className={errors.email ? "inputError" : ""}
                            value={formUser.email}
                            disabled={isLoggedIn}
                            onChange={(e) => handleUserChange("email", e.target.value)}
                        />
                        {errors.email && (
                            <div className="fieldError">{errors.email}</div>
                        )}
                    </label>

                    <div className="form-buttons">
                        <button onClick={handleCancel}>
                            Ακύρωση
                        </button>
                        <button
                            className="primary"
                            onClick={() => {
                                if (validateStep1()) {
                                    setStep(2);
                                }
                            }}
                        >
                            Συνέχεια
                        </button>
                    </div>
                </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
                <div className="found-form">
                    <h3>Στοιχεία Εύρεσης</h3>

                    <label>
                        Ημερομηνία *
                        <input type="date"
                            className={errors.date ? "inputError" : ""}
                            value={foundInfo.date}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => handleFoundChange("date", e.target.value)} />
                        {errors.date && <div className="fieldError">{errors.date}</div>}

                    </label>

                    <label>
                        Περιοχή (Νομός) *
                        <select
                            className={errors.region ? "inputError" : ""}
                            value={foundInfo.region}
                            onChange={(e) => handleFoundChange("region", e.target.value)}  >
                            <option value="">Επιλέξτε</option>
                            {REGIONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        {errors.region && <div className="fieldError">{errors.region}</div>}
                    </label>

                    <label>
                        Διεύθυνση (Οδός αριθμός Πόλη Χώρα)
                        <input type="text" value={foundInfo.address} onChange={(e) => setFoundInfo({ ...foundInfo, address: e.target.value })} />
                    </label>

                    <label>
                        Κατάσταση Ζώου
                        <textarea value={foundInfo.condition} onChange={(e) => setFoundInfo({ ...foundInfo, condition: e.target.value })} />
                    </label>

                    <div className="form-buttons">
                        <button onClick={handleCancel}>
                            Ακύρωση
                        </button>
                        <button className="primary" onClick={() => {
                            if (validateStep2()) {
                                setStep(3);
                            }
                        }}>
                            Συνέχεια
                        </button>
                    </div>
                </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
                <>
                    <div className="found-form">
                        <h3>Προεπισκόπηση Δήλωσης</h3>

                        <div className="booklet-container">
                            <div className="booklet-layout">
                                <div className="booklet-header">
                                    <div className="pet-photo">
                                        <img
                                            src={pet.photoUrl || "/default-pet.jpg"}
                                            alt={pet.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/default-pet.jpg";
                                            }}
                                        />
                                    </div>
                                    <div className="booklet-top">
                                        <div className="info-box">
                                            <h4>Βασικά Στοιχεία Κατοικιδίου</h4>
                                            <p><span>Όνομα:</span> {pet.name}</p>
                                            <p><span>Είδος:</span> {pet.species || "-"}</p>
                                            <p><span>Ράτσα:</span> {pet.breed || "-"}</p>
                                            <p><span>Φύλο:</span> {pet.gender || "-"}</p>
                                            <p><span>Microchip:</span> {pet.microchip || "-"}</p>
                                            <p><span>Ημερομηνία Γέννησης:</span> {pet.birthdate || "-"}</p>
                                            <p><span>Ηλικία:</span> {pet.age || "-"}</p>
                                        </div>

                                        <div className="info-box">
                                            <h4>Στοιχεία Ευρέτη</h4>
                                            <p><span>Ονοματεπώνυμο:</span> {formUser.firstname} {formUser.lastname}</p>
                                            <p><span>Τηλέφωνο:</span> {formUser.phone || "-"}</p>
                                            <p><span>Email:</span> {formUser.email || "-"}</p>
                                        </div>

                                        <div className="info-box">
                                            <h4>Στοιχεία Εύρεσης</h4>
                                            <p><span>Ημερομηνία:</span> {foundInfo.date || "-"}</p>
                                            <p><span>Περιοχή:</span> {foundInfo.region || "-"}</p>
                                            <p><span>Διεύθυνση:</span> {foundInfo.address || "-"}</p>
                                            <p><span>Κατάσταση Ζώου:</span> {foundInfo.condition || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Μήνυμα μόνο αν είναι ιδιοκτήτης */}
                            {isPetOwner && (
                                <div className="fieldError" style={{ margin: "12px 0" }}>
                                    Δεν μπορείτε να κάνετε δήλωση εύρεσης για το δικό σας κατοικίδιο.
                                </div>
                            )}

                            <div className="form-buttons">
                                <button onClick={handleCancel}>Ακύρωση</button>

                                {/* Αν είναι ιδιοκτήτης, μην δείχνεις καν draft */}
                                {isLoggedIn && !isPetOwner && (
                                    <button type="button" onClick={() => handleSubmit("draft")}>
                                        Προσωρινή Αποθήκευση
                                    </button>
                                )}

                                {/* Αν είναι ιδιοκτήτης, μην δείχνεις καν submit */}
                                {!isPetOwner && (
                                    <button className="primary" type="button" onClick={() => handleSubmit("submitted")}>
                                        Οριστική Υποβολή
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </>
            )}

        </div>
    );
}
