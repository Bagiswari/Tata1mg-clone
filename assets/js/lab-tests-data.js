// Lab tests shown on /lab-tests/ and used by the site search.
// Only tests done on a blood or urine sample collected at home (no scans, swabs or centre visits).
// Single source of truth. Every name is copied verbatim from its official Tata 1mg test page
// (https://www.1mg.com/labs/test/...), verified 28 Sep 2026. Add new tests here only.
// Per test: name, about (one plain-language line), tests (parameters) and reports (indicative
// earliest report time from the official 1mg page; varies by city).
// /lab-tests/ is built from this file: run python tools/build_lab_tests_page.py after editing.
window.LAB_TEST_CATEGORIES = [
    {
        "id": "blood",
        "name": "Blood Count & Anaemia",
        "icon": "blood",
        "keywords": [
            "blood",
            "cbc",
            "haemoglobin",
            "hemoglobin",
            "anaemia",
            "anemia",
            "platelet",
            "iron"
        ],
        "tests": [
            {
                "name": "CBC (Complete Blood Count)",
                "about": "Checks red cells, white cells and platelets to screen overall health, infection and anaemia.",
                "tests": 21,
                "reports": "12 hrs"
            },
            {
                "name": "Complete Hemogram (CBC & ESR)",
                "about": "A full blood count plus ESR to check blood cells and signs of inflammation in the body.",
                "tests": 22,
                "reports": "12 hrs"
            },
            {
                "name": "ESR (Erythrocyte Sedimentation Rate)",
                "about": "Shows whether there is inflammation in the body by how fast red blood cells settle.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Hb (Hemoglobin)",
                "about": "Measures haemoglobin, the oxygen-carrying protein in blood, to check for anaemia.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Platelet Count",
                "about": "Counts platelets, the cells that help blood clot — often checked in fever and dengue.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Peripheral Smear Examination",
                "about": "A microscope check of blood cells for unusual size or shape, used to find the type of anaemia.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Reticulocyte Count",
                "about": "Counts young red blood cells to see how well the bone marrow is making new blood.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Total Leukocyte Count",
                "about": "Counts white blood cells to help detect infection, inflammation or bone marrow problems.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Differential Leukocyte Count",
                "about": "Shows the share of each type of white blood cell — useful in infections and allergies.",
                "tests": 5,
                "reports": "12 hrs"
            },
            {
                "name": "Absolute Eosinophil Count",
                "about": "Measures eosinophils, white cells that rise in allergies, asthma and some infections.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Blood Group ABO & Rh Factor",
                "about": "Finds your blood group (A, B, AB or O) and Rh type — needed for pregnancy, surgery and transfusion.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Serum Ferritin",
                "about": "Measures your body's stored iron — the best single check for iron deficiency.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Iron, Serum",
                "about": "Measures the iron in your blood to check for iron deficiency or iron overload.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Total Iron Binding Capacity",
                "about": "Checks how well your blood can carry iron — used with iron tests to assess anaemia.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Serum Iron Studies Basic",
                "about": "A set of iron tests to find iron deficiency or iron overload.",
                "tests": 4,
                "reports": "12 hrs"
            },
            {
                "name": "Transferrin",
                "about": "Measures transferrin, the protein that carries iron in the blood.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Thalassemia Screening Profile",
                "about": "Screens for thalassemia, an inherited blood disorder — often advised before or during pregnancy.",
                "tests": 7,
                "reports": "24 hrs"
            },
            {
                "name": "Hemoglobin HPLC / Electrophoresis",
                "about": "Identifies abnormal types of haemoglobin to diagnose thalassemia and related disorders."
            },
            {
                "name": "G6PD - Quantitative Reflex Qualitative",
                "about": "Checks for G6PD enzyme deficiency, an inherited condition where some medicines or foods can break down red cells.",
                "tests": 3,
                "reports": "48 hrs"
            },
            {
                "name": "Sickling Test",
                "about": "Screens for sickle cell disease or sickle cell trait.",
                "tests": 1,
                "reports": "30 hrs"
            }
        ]
    },
    {
        "id": "diabetes",
        "name": "Diabetes",
        "icon": "diabetes",
        "keywords": [
            "diabetes",
            "sugar",
            "glucose",
            "insulin"
        ],
        "tests": [
            {
                "name": "FBS (Fasting Blood Sugar)",
                "about": "Measures blood sugar after an overnight fast to screen for and monitor diabetes.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "PPBS (Postprandial Blood Sugar)",
                "about": "Measures blood sugar about 2 hours after a meal to check how your body handles food.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "RBS (Random Blood Sugar)",
                "about": "A quick blood sugar check at any time of day, without fasting.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "HbA1c (Glycosylated Hemoglobin)",
                "about": "Shows your average blood sugar over the last 2–3 months — key for diagnosing and tracking diabetes.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Diabetes Screening (HbA1C & Fasting Sugar)",
                "about": "Fasting sugar plus HbA1c together to check for diabetes or prediabetes.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Glucose 2 hrs Post 75g Load",
                "about": "Sugar is checked 2 hours after a glucose drink to diagnose diabetes or prediabetes.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Insulin, Fasting",
                "about": "Measures insulin after fasting to check for insulin resistance or low sugar episodes.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Insulin - Post Prandial",
                "about": "Measures insulin about 2 hours after a meal to see how your body responds to food.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "C-Peptide, Fasting",
                "about": "Shows how much insulin your pancreas is making — helps tell type 1 from type 2 diabetes.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "HOMA IR; Insulin Resistance Index",
                "about": "Uses fasting sugar and insulin to check for insulin resistance — common in PCOS and weight gain.",
                "tests": 5,
                "reports": "12 hrs"
            },
            {
                "name": "Fructosamine",
                "about": "Shows your average blood sugar over the last 2–3 weeks.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "GAD-65 AntibodyType I Diabetes",
                "about": "Looks for antibodies linked to type 1 (autoimmune) diabetes.",
                "tests": 1,
                "reports": "3 days"
            }
        ]
    },
    {
        "id": "thyroid",
        "name": "Thyroid",
        "icon": "thyroid",
        "keywords": [
            "thyroid",
            "tsh",
            "t3",
            "t4"
        ],
        "tests": [
            {
                "name": "Thyroid Profile Total (T3, T4 & TSH)",
                "about": "Checks T3, T4 and TSH to see how well your thyroid is working.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Thyroid Profile Free (FT3, FT4 & TSH)",
                "about": "Checks free thyroid hormones and TSH for a more precise picture of thyroid function.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "FT3 & FT4 (Free T3 & Free T4)",
                "about": "Measures the active (free) thyroid hormones to detect an over- or under-active thyroid.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Triiodothyronine - Total (T3)",
                "about": "Measures total T3 thyroid hormone to check thyroid function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Thyroxine - Total (T4)",
                "about": "Measures total T4 thyroid hormone to check thyroid function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Thyroxine - Free (FT4)",
                "about": "Measures the active form of T4 to check thyroid function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Triiodothyronine - Free (FT3)",
                "about": "Measures the active form of T3 to check thyroid function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Anti Thyroid Antibodies Panel",
                "about": "Looks for antibodies that cause autoimmune thyroid problems like Hashimoto's.",
                "tests": 2,
                "reports": "18 hrs"
            },
            {
                "name": "Anti Thyroglobulin Antibody",
                "about": "Detects antibodies against the thyroid, seen in autoimmune thyroid disease.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Thyroglobulin",
                "about": "Mainly used to follow up people treated for thyroid cancer.",
                "tests": 1,
                "reports": "48 hrs"
            },
            {
                "name": "TSH Receptor Antibodies",
                "about": "Detects antibodies that cause an over-active thyroid (Graves' disease).",
                "tests": 1,
                "reports": "18 hrs"
            }
        ]
    },
    {
        "id": "heart",
        "name": "Heart & Cholesterol",
        "icon": "heart",
        "keywords": [
            "heart",
            "cholesterol",
            "lipid",
            "cardiac",
            "triglycerides"
        ],
        "tests": [
            {
                "name": "Lipid Profile",
                "about": "Checks cholesterol and triglycerides to assess your heart health.",
                "tests": 8,
                "reports": "12 hrs"
            },
            {
                "name": "Lipid Profile, Non Fasting",
                "about": "A cholesterol and triglyceride check that can be done without fasting.",
                "tests": 8,
                "reports": "12 hrs"
            },
            {
                "name": "Extended Lipid Profile",
                "about": "A detailed cholesterol and fat analysis for a fuller view of heart risk.",
                "tests": 14,
                "reports": "12 hrs"
            },
            {
                "name": "Cholesterol - Total",
                "about": "Measures the total cholesterol in your blood.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Cholesterol - HDL",
                "about": "Measures HDL, the 'good' cholesterol that protects the heart.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "LDL Cholesterol - Direct",
                "about": "Directly measures LDL, the 'bad' cholesterol linked to heart attack and stroke.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Triglycerides",
                "about": "Measures triglycerides, a blood fat linked to heart disease.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Lipoprotein (a)",
                "about": "Checks an inherited cholesterol particle that raises heart attack and stroke risk.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Apolipoproteins A1 & B",
                "about": "Measures the proteins that carry cholesterol, for a sharper view of heart risk.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "hsCRP (High Sensitive CRP)",
                "about": "Detects low-level inflammation that is linked to heart disease risk.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "High Sensitive Troponin-I, Quantitative",
                "about": "Detects heart muscle damage, such as from a heart attack.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Creatine Kinase MB",
                "about": "Measures an enzyme released when the heart muscle is damaged.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "NT-Pro BNP",
                "about": "Helps detect and monitor heart failure.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Serum Homocysteine",
                "about": "High levels are linked to heart disease, stroke and low B12 or folate.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Advanced Cardiac Risk Markers",
                "about": "A combined set of markers giving a detailed picture of your heart disease risk.",
                "tests": 6,
                "reports": "12 hrs"
            }
        ]
    },
    {
        "id": "liver",
        "name": "Liver",
        "icon": "liver",
        "keywords": [
            "liver",
            "lft",
            "sgot",
            "sgpt",
            "bilirubin",
            "jaundice"
        ],
        "tests": [
            {
                "name": "LFT (Liver Function Test)",
                "about": "Checks liver enzymes, proteins and bilirubin to assess liver health.",
                "tests": 11,
                "reports": "12 hrs"
            },
            {
                "name": "SGPT (Alanine Transaminase)",
                "about": "Measures a liver enzyme that rises in liver damage, fatty liver or hepatitis.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "SGOT (Aspartate Aminotransferase)",
                "about": "Measures an enzyme that rises in liver (and sometimes heart or muscle) damage.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "SGPT & SGOT",
                "about": "Two key liver enzymes together to check for liver damage.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Bilirubin (Total, Direct and Indirect)",
                "about": "Checks bilirubin levels to look for jaundice and liver or bile problems.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Alkaline Phosphatase (ALP)",
                "about": "Measures an enzyme linked to liver, bile duct and bone health.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Gamma Glutamyl Transferase",
                "about": "A liver enzyme that rises with bile duct problems or alcohol use.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Serum Albumin",
                "about": "Measures albumin, a protein made by the liver, to check nutrition and liver or kidney health.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Protein Total, Serum",
                "about": "Measures total protein in the blood to check nutrition, liver and kidney health.",
                "tests": 4,
                "reports": "12 hrs"
            },
            {
                "name": "Hepatitis B Surface Antigen (HBsAg)",
                "about": "Detects an active hepatitis B infection.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Hepatitis C Virus (HCV) Antibody",
                "about": "Screens for hepatitis C infection.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Hepatitis A Antibody, IgG + IgM",
                "about": "Shows a current or past hepatitis A infection, or immunity from vaccination.",
                "tests": 2,
                "reports": "18 hrs"
            },
            {
                "name": "Hepatitis E Virus, IgM Antibody",
                "about": "Detects a recent hepatitis E infection, a common cause of jaundice.",
                "tests": 1,
                "reports": "48 hrs"
            }
        ]
    },
    {
        "id": "kidney",
        "name": "Kidney & Electrolytes",
        "icon": "kidney",
        "keywords": [
            "kidney",
            "kft",
            "rft",
            "creatinine",
            "urea",
            "electrolytes",
            "sodium",
            "potassium"
        ],
        "tests": [
            {
                "name": "BUN-Urea-Creatinine",
                "about": "Basic kidney check showing how well your kidneys filter waste.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Serum Creatinine",
                "about": "A key marker of how well your kidneys are working.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Creatinine with eGFR (18 Years & Above)",
                "about": "Creatinine with an estimate of kidney filtering capacity (eGFR) for adults.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Blood Urea",
                "about": "Measures urea, a waste product, to check kidney function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Blood Urea Nitrogen",
                "about": "Measures urea nitrogen in blood to check kidney function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Uric Acid, Serum",
                "about": "High uric acid can cause gout and joint pain, and is linked to kidney stones.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Serum Electrolytes",
                "about": "Checks sodium, potassium and chloride — important for kidneys, nerves and heart.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Sodium",
                "about": "Measures sodium, a salt the body needs for fluid balance, nerves and muscles.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Potassium",
                "about": "Measures potassium, which keeps the heart and muscles working properly.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Chloride",
                "about": "Measures chloride, which helps balance fluids and acids in the body.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Cystatin C",
                "about": "An alternative kidney function marker, useful when creatinine is not reliable.",
                "tests": 1,
                "reports": "36 hrs"
            },
            {
                "name": "Protein/Creatinine Ratio",
                "about": "A urine test that checks for protein leaking from the kidneys.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Kidney Health Screen",
                "about": "A set of blood and urine tests for an overall check of kidney health.",
                "tests": 23,
                "reports": "12 hrs"
            },
            {
                "name": "Stone Analysis, Kidney calculus",
                "about": "Finds what a passed kidney stone is made of, to help prevent new ones.",
                "tests": 1,
                "reports": "4 days"
            }
        ]
    },
    {
        "id": "vitamins",
        "name": "Vitamins & Minerals",
        "icon": "vitamins",
        "keywords": [
            "vitamin",
            "b12",
            "vitamin d",
            "calcium",
            "deficiency",
            "fatigue",
            "mineral"
        ],
        "tests": [
            {
                "name": "Vitamin D (25-Hydroxy)",
                "about": "Checks vitamin D, needed for strong bones, muscles and immunity.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Vitamin B12",
                "about": "Checks vitamin B12, needed for nerves, energy and healthy blood.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Vitamin B9 (Folic Acid)",
                "about": "Checks folic acid, important for healthy blood and in pregnancy.",
                "tests": 1,
                "reports": "24 hrs"
            },
            {
                "name": "Vitamin D (25-Hydroxy) & Vitamin B12",
                "about": "Checks two of the most common deficiencies — vitamin D and B12 — together.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Vitamin D, B12 & Calcium",
                "about": "Checks vitamin D, B12 and calcium for bone strength, nerves and energy.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Vitamin Profile",
                "about": "Checks vitamin D, B12 and folate to find common vitamin deficiencies.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Vitamin B Complex Profile",
                "about": "Checks several B vitamins (B1, B2, B6, B9, B12) to find deficiencies.",
                "tests": 5,
                "reports": "10 days"
            },
            {
                "name": "Vitamin E - Quantitative",
                "about": "Measures vitamin E, an antioxidant that protects body cells.",
                "tests": 1,
                "reports": "4 days"
            },
            {
                "name": "Serum Calcium",
                "about": "Measures calcium, needed for bones, muscles, nerves and the heart.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Calcium Ionized",
                "about": "Measures the active, free form of calcium for a more precise calcium check.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Magnesium",
                "about": "Measures magnesium, a mineral needed for muscles, nerves and heart rhythm.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Phosphorus, Serum",
                "about": "Measures phosphorus, a mineral linked to bone and kidney health.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Zinc, Serum",
                "about": "Checks zinc, a mineral that supports immunity, healing and metabolism.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Copper Serum",
                "about": "Measures copper, a mineral needed for blood, nerves and immunity.",
                "tests": 1,
                "reports": "5 days"
            }
        ]
    },
    {
        "id": "hormones",
        "name": "Hormones & Fertility",
        "icon": "hormones",
        "keywords": [
            "hormone",
            "fertility",
            "pcos",
            "pcod",
            "testosterone",
            "pregnancy",
            "amh"
        ],
        "tests": [
            {
                "name": "Serum Prolactin",
                "about": "Checks prolactin, a hormone linked to periods, fertility and breast milk.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "LH & FSH",
                "about": "Two hormones that control fertility, periods and sperm production.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Luteinising Hormone",
                "about": "A hormone that controls ovulation in women and testosterone in men.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Follicle Stimulating Hormone",
                "about": "A hormone that controls egg and sperm production.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "FSH, LH & Prolactin",
                "about": "Three key fertility hormones together — often advised for irregular periods or PCOS.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "AMH (Anti-Mullerian Hormone)",
                "about": "Gives an idea of a woman's egg reserve — useful in fertility planning and PCOS.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "E2 (Estradiol)",
                "about": "Measures estradiol, the main female hormone, for periods, fertility and menopause.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Progesterone",
                "about": "Checks progesterone to confirm ovulation and support fertility and pregnancy care.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Testosterone Total",
                "about": "Measures testosterone, the main male hormone, also checked in women with PCOS.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Testosterone Free",
                "about": "Measures the active (free) testosterone in the blood.",
                "tests": 1,
                "reports": "36 hrs"
            },
            {
                "name": "Testosterone Total & Free",
                "about": "Measures both total and free testosterone for a complete picture.",
                "tests": 2,
                "reports": "36 hrs"
            },
            {
                "name": "Dehydroepiandrosterone Sulphate",
                "about": "Checks an adrenal hormone (DHEAS) — often tested in PCOS and excess hair growth.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Sex Hormone Binding Globulin",
                "about": "Measures the protein that carries sex hormones — helps interpret testosterone results.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Cortisol, Serum (Morning Sample)",
                "about": "Measures cortisol, the stress hormone, to check the adrenal glands.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "PTH (Intact Parathyroid Hormone)",
                "about": "Checks the hormone that controls calcium levels and bone health.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Growth Hormone",
                "about": "Measures growth hormone to check for growth and pituitary problems.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Urine Pregnancy Test",
                "about": "Detects the pregnancy hormone (hCG) in urine.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "HCG Beta Total Quantitative, Maternal",
                "about": "A blood test that confirms and tracks early pregnancy by measuring hCG.",
                "tests": 1,
                "reports": "12 hrs"
            }
        ]
    },
    {
        "id": "fever",
        "name": "Fever & Infections",
        "icon": "fever",
        "keywords": [
            "fever",
            "dengue",
            "infection",
            "malaria",
            "typhoid",
            "covid",
            "viral"
        ],
        "tests": [
            {
                "name": "Dengue Fever NS1 Antigen",
                "about": "Detects dengue early — best done in the first 5 days of fever.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Dengue Fever, IgG & IgM",
                "about": "Detects dengue antibodies to tell a recent infection from a past one.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Dengue Fever Antigen NS1, IgG & IgM",
                "about": "A complete dengue check — NS1 antigen plus IgG and IgM antibodies.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Malarial Antigen (Vivax & Falciparum) Detection",
                "about": "A quick test to detect the two common types of malaria.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Widal Test (Slide Agglutination)",
                "about": "A common test to help detect typhoid fever.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Salmonella Typhi (Typhidot) IgG & IgM",
                "about": "A rapid antibody test to help diagnose typhoid fever.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "Chikungunya, IgM",
                "about": "Detects a recent chikungunya infection.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Scrub Typhus - IgM antibody",
                "about": "Detects scrub typhus, an infection spread by mite bites that causes fever.",
                "tests": 1,
                "reports": "3 days"
            },
            {
                "name": "Leptospira - IgM antibody",
                "about": "Detects leptospirosis, an infection spread through contaminated water or soil.",
                "tests": 1,
                "reports": "3 days"
            },
            {
                "name": "CRP (C-Reactive Protein), Quantitative",
                "about": "Measures CRP, a marker of infection or inflammation in the body.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Procalcitonin",
                "about": "Helps tell a bacterial infection from a viral one in serious illness.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "HIV Combo (Antigen And Antibody) Test",
                "about": "A modern screening test for HIV-1 and HIV-2 infection.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "RPR (Rapid Plasma Reagin)",
                "about": "A screening blood test for syphilis.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Mantoux Test",
                "about": "A skin test to check for exposure to tuberculosis (TB)."
            },
            {
                "name": "Culture Aerobic Blood (Automated), Adult",
                "about": "Grows bacteria from a blood sample to find a blood infection and the right antibiotic.",
                "tests": 1,
                "reports": "5 days"
            },
            {
                "name": "Helicobacter Pylori, IgG",
                "about": "Detects H. pylori, a stomach bacterium that can cause gastritis and ulcers.",
                "tests": 1,
                "reports": "8 days"
            },
            {
                "name": "TORCH Profile 8 Parameters",
                "about": "Screens for infections that can affect pregnancy and the unborn baby.",
                "tests": 8,
                "reports": "48 hrs"
            }
        ]
    },
    {
        "id": "arthritis",
        "name": "Arthritis & Autoimmune",
        "icon": "arthritis",
        "keywords": [
            "arthritis",
            "joint",
            "autoimmune",
            "rheumatoid",
            "uric acid",
            "gout"
        ],
        "tests": [
            {
                "name": "Rheumatoid Factor - Quantitative",
                "about": "Helps diagnose rheumatoid arthritis and other autoimmune conditions.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Anti-CCP Antibody",
                "about": "A specific test that helps confirm rheumatoid arthritis.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Anti Nuclear Antibody, EIA",
                "about": "Screens for autoimmune diseases such as lupus.",
                "tests": 1,
                "reports": "39 hrs"
            },
            {
                "name": "Anti ds-DNA Antibody, EIA",
                "about": "Helps diagnose and monitor lupus (SLE).",
                "tests": 1,
                "reports": "8 days"
            },
            {
                "name": "HLA - B27 Detection by Flowcytometry",
                "about": "Checks for a gene marker linked to ankylosing spondylitis and back stiffness.",
                "tests": 1,
                "reports": "48 hrs"
            },
            {
                "name": "Anti Streptolysin O Titer",
                "about": "Shows a recent strep throat infection — helpful in rheumatic fever and joint pain.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "C3 Complement",
                "about": "Measures an immune system protein — used in lupus and kidney inflammation.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "C4 Complement",
                "about": "Measures an immune system protein — used in autoimmune diseases like lupus.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Rheumatoid Arthritis Profile",
                "about": "A set of tests to help detect rheumatoid arthritis.",
                "tests": 10,
                "reports": "48 hrs"
            }
        ]
    },
    {
        "id": "allergy",
        "name": "Allergy",
        "icon": "allergy",
        "keywords": [
            "allergy",
            "ige",
            "allergic"
        ],
        "tests": [
            {
                "name": "Total IgE",
                "about": "Shows your overall allergy level — a starting test for allergies.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Allergy Panel - Animal",
                "about": "Checks for allergies to pets and other animals such as cats and dogs.",
                "tests": 5,
                "reports": "3 days"
            },
            {
                "name": "Allergy Dust Mite Panel",
                "about": "Checks for allergy to house dust mites, a common cause of sneezing and asthma.",
                "tests": 4,
                "reports": "48 hrs"
            },
            {
                "name": "Allergy Panel - Nuts",
                "about": "Checks for allergies to peanuts and other common nuts.",
                "tests": 9,
                "reports": "3 days"
            },
            {
                "name": "Allergy Panel - Milk & Milk Products",
                "about": "Checks for allergy to milk proteins.",
                "tests": 7,
                "reports": "4 days"
            },
            {
                "name": "Allergy Vegetarian Panel Basic",
                "about": "Checks for allergies to common vegetarian foods.",
                "tests": 8,
                "reports": "48 hrs"
            },
            {
                "name": "Allergy - Non-vegetarian Panel, ImmunoCAP",
                "about": "Checks for allergies to common non-vegetarian foods like eggs, fish and meat.",
                "tests": 11,
                "reports": "48 hrs"
            },
            {
                "name": "Allergy Panel - Tree Pollen",
                "about": "Checks for allergy to tree pollen, a cause of seasonal sneezing and asthma.",
                "tests": 4,
                "reports": "3 days"
            }
        ]
    },
    {
        "id": "cancer",
        "name": "Cancer Markers",
        "icon": "cancer",
        "keywords": [
            "cancer",
            "tumour",
            "tumor",
            "marker",
            "psa",
            "ca 125"
        ],
        "tests": [
            {
                "name": "PSA (Prostate Specific Antigen) Total",
                "about": "A prostate health check — screens for prostate enlargement, inflammation or cancer.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Prostate Specific Antigen (Free) PSA",
                "about": "Used with total PSA to tell prostate cancer from other prostate problems.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "PSA Profile",
                "about": "Total and free PSA together for a fuller prostate check.",
                "tests": 3,
                "reports": "18 hrs"
            },
            {
                "name": "CA125 (Cancer Antigen 125)",
                "about": "A marker mainly used to monitor ovarian cancer.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "CA15.3",
                "about": "A marker mainly used to monitor breast cancer.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "CA19.9",
                "about": "A marker mainly used to monitor pancreatic and some digestive cancers.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Carcino Embryonic Antigen",
                "about": "A marker mainly used to monitor bowel (colorectal) cancer.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Alpha Feto Protein, Tumour Marker",
                "about": "A marker used for liver and certain other cancers.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Cancer Marker Profile - Male",
                "about": "A set of common tumour markers for men, for risk assessment and follow-up.",
                "tests": 31,
                "reports": "3 days"
            },
            {
                "name": "Cancer Marker Profile - Female",
                "about": "A set of common tumour markers for women, for risk assessment and follow-up.",
                "tests": 29,
                "reports": "48 hrs"
            }
        ]
    },
    {
        "id": "urine",
        "name": "Urine Tests",
        "icon": "urine",
        "keywords": [
            "urine"
        ],
        "tests": [
            {
                "name": "Urine R/M (Urine Routine & Microscopy)",
                "about": "A routine urine check for infection, kidney problems and diabetes.",
                "tests": 19,
                "reports": "12 hrs"
            },
            {
                "name": "Urine Protein (Albumin), Random",
                "about": "Checks for protein leaking into the urine, an early sign of kidney trouble.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Microalbumin Creatinine Ratio, Urine",
                "about": "Detects early kidney damage — recommended yearly for people with diabetes or high BP.",
                "tests": 3,
                "reports": "12 hrs"
            },
            {
                "name": "Urine Creatinine, Random",
                "about": "Measures creatinine in urine to help assess kidney function.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Urine Ketone, Qualitative",
                "about": "Checks urine for ketones — seen in uncontrolled diabetes, fasting or dieting.",
                "tests": 1,
                "reports": "12 hrs"
            }
        ]
    },
    {
        "id": "coagulation",
        "name": "Coagulation",
        "icon": "coagulation",
        "keywords": [
            "coagulation",
            "clotting",
            "pt inr",
            "bleeding",
            "d-dimer"
        ],
        "tests": [
            {
                "name": "PT INR (Prothrombin Time with INR)",
                "about": "Checks how fast blood clots — essential if you take blood thinners.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Activated Partial Thromboplastin Time",
                "about": "Checks the blood's ability to clot, before surgery or for unexplained bleeding.",
                "tests": 1,
                "reports": "12 hrs"
            },
            {
                "name": "Coagulation Profile (PT/INR & aPTT)",
                "about": "Key clotting tests together — often advised before surgery.",
                "tests": 2,
                "reports": "12 hrs"
            },
            {
                "name": "D-Dimer",
                "about": "Helps rule out a blood clot in the legs or lungs.",
                "tests": 1,
                "reports": "18 hrs"
            },
            {
                "name": "Fibrinogen",
                "about": "Measures a protein needed for blood clotting.",
                "tests": 1,
                "reports": "48 hrs"
            }
        ]
    }
];
