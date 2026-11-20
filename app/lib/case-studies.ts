
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  setDoc ,
} from "firebase/firestore";

import { db } from "./firebase";


export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  coverImage: string;
  coverImageAlt?: string;
  shortDescription: string;
  projectOverview: string;
  theChallenge: string;
  ourApproach: string[];
  theAsk: string;
  whatWeDid: string;
  theResults: string;
  servicesProvided: string[];
  metrics: { value: string; label: string }[];
  gallery?: string[];
  featured?: boolean;
  order?: number;
  status: "published" | "draft";
  createdAt?: any;
  updatedAt?: any;
  publishedAt?: any;
}

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-dream-decor",
    slug: "dream-decor",
    client: "Dream Decor",
    industry: "Home Decor",
    title: "Dream Decor – Transforming Social Presence Into High-Intent Lead Pipeline",
    coverImage: "/images/dream-decor-curved-4k.jpg",
    coverImageAlt: "Dream Decor curved living interior project showcase in 4K clarity",
    shortDescription:
      "Struggling to attract quality leads and get noticed on social media, Dream Decor partnered with Growth Enzyme to build an organic and audience-focused lead engine.",
    projectOverview:
      "Dream Decor is an interior design and home decor studio known for beautiful craftsmanship. While their physical projects spoke for themselves, their digital presence lacked reach and consistency, leaving high-value homeowner inquiries untapped.",
    theChallenge:
      "Not getting lead. Struggling to attract quality leads and get noticed on social media in a crowded, competitive home decor market.",
    ourApproach: [
      "Strategic social media content showcasing aesthetic spaces",
      "Audience-focused lead generation campaigns",
      "Consistent brand visibility across local feeds",
      "Organic growth & active community engagement",
      "Converting social interest into direct client enquiries",
    ],
    theAsk: "Get noticed. Attract the right audience. Generate quality leads.",
    whatWeDid:
      "Built a focused social strategy that turned content into visibility, engagement and genuine enquiries.",
    theResults:
      "Stronger social presence, better audience reach and a steady flow of quality enquiries.",
    servicesProvided: [
      "Social Media Strategy",
      "Audience-Focused Lead Gen",
      "Organic Growth",
      "Content Creation",
      "Meta Ads",
    ],
    metrics: [
      { value: "36+", label: "Direct Inquiries" },
      { value: "47K+", label: "Audience Views" },
      { value: "Steady Flow", label: "Quality Leads" },
    ],
    gallery: [
      "/images/dream-decor-curved-4k.jpg",
      "/images/dream-decor-living-4k.jpg",
      "/images/dream-decor-kitchen-4k.jpg",
    ],
    featured: true,
    order: 1,
    status: "published",
  },
  {
    id: "cs-big-toyz",
    slug: "big-toyz-preowned-cars",
    client: "Big Toyz- preowned cars",
    industry: "Pre - Owned Seller",
    title: "Big Toyz – Accelerating Used Car Inquiries Through Targeted Promotion & Web Presence",
    coverImage: "/images/big-toyz-4k.jpg",
    coverImageAlt: "Big Toyz luxury car showroom inventory in 4K clarity",
    shortDescription:
      "Low car sales due to limited brand awareness and online visibility prompted Big Toyz to launch an enquiry-focused digital vehicle showroom.",
    projectOverview:
      "Big Toyz is a pre-owned automobile dealership offering vetted multi-brand vehicles. Without a strong online footprint, prospective buyers couldn't easily browse available stock or initiate quick financing and purchase inquiries.",
    theChallenge:
      "Low car sales due to limited brand awareness and online visibility.",
    ourApproach: [
      "Social media strategy & car-focused content",
      "Page promotion to increase regional visibility",
      "Car-focused content to drive buyer enquiries",
      "Brand awareness & automotive audience growth",
      "Affordable, conversion-focused inventory website",
    ],
    theAsk:
      "Get Big Toyz noticed, promote available cars, and make it easier for customers to enquire.",
    whatWeDid:
      "Built their online presence with engaging car content, targeted promotion, and a professional website designed around customer enquiries.",
    theResults:
      "More visibility for their cars, stronger online presence, and an easier path from seeing a car to inquiring.",
    servicesProvided: [
      "Social Media Strategy",
      "Page Promotion",
      "Automotive Content",
      "Brand Awareness",
      "Conversion Website",
    ],
    metrics: [
      { value: "100%", label: "Digital Catalog" },
      { value: "High Intent", label: "Car Buyer Reach" },
      { value: "Active", label: "Daily Enquiries" },
    ],
    gallery: ["/images/big-toyz-4k.jpg", "/images/big-toyz-showroom-4k.jpg"],
    featured: true,
    order: 2,
    status: "published",
  },
  {
    id: "cs-abdul-khadir-hospital",
    slug: "abdul-khadir-hospital",
    client: "Abdul khadir hospital",
    industry: "Hospital",
    title: "Abdul Khadir Hospital – Translating a 60-Year Healing Legacy Into Patient-First Digital Care",
    coverImage: "/images/abdul-khadir-hospital-4k.jpg",
    coverImageAlt: "Abdul Khadir Hospital modern patient facility in 4K clarity",
    shortDescription:
      "Serving Nagercoil since 1962, this renowned hospital moved its 60+ year reputation into the digital space with personal doctor branding and streamlined patient journeys.",
    projectOverview:
      "Abdul Khadir Hospital has provided trusted clinical excellence across Nagercoil and South India for over six decades. To connect with a younger generation of patients and families seeking modern medical consultations, they sought a dignified, modern digital identity.",
    theChallenge:
      "A trusted hospital serving Nagercoil since 1962 wanted to move its strong offline reputation into the digital space.",
    ourApproach: [
      "Digital presence & healthcare brand strategy",
      "Personal branding for doctors for stronger patient trust",
      "Professional, patient-friendly responsive website",
      "Social media content & public health awareness",
      "Local visibility to drive hospital enquiries & walk-ins",
    ],
    theAsk:
      "Bring a trusted 60+ year legacy online and turn digital visibility into real patient visits.",
    whatWeDid:
      "Built a stronger digital identity with personal branding, engaging content, and a professional website designed around patients and their needs.",
    theResults:
      "A more visible digital presence, stronger brand trust, and a clearer online journey from discovering the hospital to booking visits.",
    servicesProvided: [
      "Digital Brand Strategy",
      "Personal Doctor Branding",
      "Patient-Friendly Website",
      "Social Media Content",
      "Local Hospital SEO",
    ],
    metrics: [
      { value: "60+ Yrs", label: "Legacy Preserved" },
      { value: "Trusted", label: "Doctor Branding" },
      { value: "Streamlined", label: "Patient Walk-ins" },
    ],
    gallery: [
      "/images/abdul-khadir-hospital-4k.jpg",
      "/images/abdul-khadir-doctor-4k.jpg",
    ],
    featured: true,
    order: 3,
    status: "published",
  },
  {
    id: "cs-jpr-traders",
    slug: "jpr-traders",
    client: "JPR Traders",
    industry: "Furnishing",
    title: "JPR Traders – Unifying Multi-Warehouse Operations Into a Custom Business Management Platform",
    coverImage: "/images/jpr-traders-4k.jpg",
    coverImageAlt: "JPR Traders modern furnishing collection in 4K clarity",
    shortDescription:
      "Managing 3 warehouses meant juggling clients, stock, profits, and deliveries across disconnected systems until Growth Enzyme engineered a custom all-in-one software solution.",
    projectOverview:
      "JPR Traders is a major furnishing distributor operating 3 large warehouses. Juggling dispatches, warehouse stock counts, invoices, driver GPS locations, and payroll across separate spreadsheets caused delays and blind spots.",
    theChallenge:
      "Managing 3 warehouses meant juggling clients, stock, profits, expenses, deliveries, invoices, attendance and salaries across different systems.",
    ourApproach: [
      "Custom business management software built specifically for furnishing operations",
      "Centralised client & live stock management across all 3 warehouses",
      "Profit and expense tracking with real-time financial reporting",
      "GPS-based delivery tracking for fleet dispatches",
      "Digital invoices & automated records repository",
      "Attendance and salary management for warehouse staff",
    ],
    theAsk:
      "Bring the entire business under one system and make daily operations easier to track.",
    whatWeDid:
      "Built a customised software solution connecting warehouse, sales, finance, delivery and employee operations in one place.",
    theResults:
      "Less manual work, better visibility across warehouses, faster tracking, and more control over everyday business operations.",
    servicesProvided: [
      "Custom Business Software",
      "Warehouse Stock Management",
      "GPS Delivery Tracking",
      "Digital Invoicing",
      "Attendance & Salary Automation",
    ],
    metrics: [
      { value: "3 Warehouses", label: "Single Dashboard" },
      { value: "Real-time", label: "GPS Fleet Tracking" },
      { value: "Zero Delay", label: "Automated Invoicing" },
    ],
    gallery: [
      "/images/jpr-traders-4k.jpg",
      "/images/jpr-traders-warehouse-4k.jpg",
    ],
    featured: false,
    order: 4,
    status: "published",
  },
  {
    id: "cs-rojes-comfortworks",
    slug: "rojes-comfortworks",
    client: "Rojes comfortworks",
    industry: "Mattress manufacturer",
    title: "Rojes Comfortworks – Scaling Direct-To-Consumer Mattress Sales With Meta Ads & SEO",
    coverImage: "/images/rojes-comfortworks-4k.jpg",
    coverImageAlt: "Rojes Comfortworks ergonomic mattress collection in 4K clarity",
    shortDescription:
      "Needed a professional e-commerce website, stronger digital visibility, better Google presence, and a reliable way to bring in quality leads.",
    projectOverview:
      "Rojes Comfortworks manufactures high-quality sleep and mattress products. Transitioning from traditional wholesale dealer models into direct buyer relationships required both high-intent ad campaigns and top Google rankings.",
    theChallenge:
      "Needed a professional e-commerce website, stronger digital visibility, better Google presence, and a reliable way to bring in quality leads.",
    ourApproach: [
      "Social media presence & product demonstration content",
      "Meta Ads for targeted local and regional lead generation",
      "Audience-focused sleep wellness campaigns",
      "Google visibility & local search engine optimization",
      "Lead-focused digital strategy with instant inquiry flows",
    ],
    theAsk:
      "Build a stronger online presence and bring in more relevant customers looking for mattresses and comfort products.",
    whatWeDid:
      "Built their digital presence and launched targeted Meta Ads to reach the right audience and turn interest into genuine enquiries.",
    theResults:
      "Increased online visibility, stronger social presence, and a steady flow of quality leads from targeted campaigns.",
    servicesProvided: [
      "E-Commerce Web Design",
      "Meta Ads",
      "Targeted Lead Generation",
      "Local SEO & Google Search",
      "Creative Production",
    ],
    metrics: [
      { value: "Steady Flow", label: "Direct Inquiries" },
      { value: "Top Rank", label: "Local Google Pack" },
      { value: "High ROI", label: "Meta Ad Conversion" },
    ],
    gallery: [
      "/images/rojes-comfortworks-4k.jpg",
      "/images/rojes-bedroom-4k.jpg",
    ],
    featured: false,
    order: 5,
    status: "published",
  },
  {
    id: "cs-pattanam-vaithiyar",
    slug: "pattanam-vaithiyar",
    client: "Pattanam Vaithiyar",
    industry: "Siddha",
    title: "Pattanam Vaithiyar – Bringing a 4th-Generation Siddha Thailam Legacy to South India",
    coverImage: "/images/pattanam-vaithiyar-4k.jpg",
    coverImageAlt: "Pattanam Vaithiyar 4th-generation Siddha thailam herbal medicine in 4K clarity",
    shortDescription:
      "A trusted 4th-generation Thailam brand with an existing customer base wanted to take its legacy online and reach more people across South India.",
    projectOverview:
      "Pattanam Vaithiyar carries four generations of proprietary Siddha medicinal formulas and herbal pain relief thailams. The challenge was expanding awareness across southern states while maintaining genuine veneration for their heritage origins.",
    theChallenge:
      "A trusted 4th-generation Thailam brand with an existing customer base wanted to take its legacy online and reach more people across South India.",
    ourApproach: [
      "Legacy-focused landing website engineered for high conversion",
      "Social media branding & authentic customer testimonials",
      "Heritage-led brand storytelling rooted in traditional Siddha wisdom",
      "South India-focused audience strategy across language demographics",
      "Building trust through online visibility and transparent efficacy",
    ],
    theAsk:
      "Bring a trusted family legacy online and help more South Indian customers discover the brand.",
    whatWeDid:
      "Created a simple legacy-focused website and built a social presence that connected the brand’s heritage with today’s digital audience.",
    theResults:
      "A stronger digital identity, wider online visibility, and an easier way for new customers to discover the legacy behind the product.",
    servicesProvided: [
      "Legacy Landing Website",
      "Heritage Brand Storytelling",
      "Social Media Branding",
      "South India Demographic Ads",
      "Online Trust Architecture",
    ],
    metrics: [
      { value: "4th Gen", label: "Heritage Preserved" },
      { value: "Pan-South India", label: "Audience Expansion" },
      { value: "Frictionless", label: "Order Discovery" },
    ],
    gallery: [
      "/images/pattanam-vaithiyar-4k.jpg",
      "/images/pattanam-apothecary-4k.jpg",
    ],
    featured: false,
    order: 6,
    status: "published",
  },
];

const caseStudiesRef = collection(db, "case-studies");

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const q = query(caseStudiesRef, orderBy("order", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_CASE_STUDIES;
    }

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<CaseStudy, "id">),
    }));
  } catch (err) {
    console.warn("Notice fetching all case studies (falling back to initial portfolio):", err);
    return INITIAL_CASE_STUDIES;
  }
}

export async function getCaseStudiesForDashboard(): Promise<CaseStudy[]> {
  const snapshot = await getDocs(caseStudiesRef);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<CaseStudy, "id">),
  }));
}

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  try {
    const q = query(
      caseStudiesRef,
      where("status", "==", "published"),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_CASE_STUDIES.filter((cs) => cs.status === "published");
    }

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<CaseStudy, "id">),
    }));
  } catch (err) {
    console.warn("Notice fetching published case studies (falling back to initial portfolio):", err);
    return INITIAL_CASE_STUDIES.filter((cs) => cs.status === "published");
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const q = query(caseStudiesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<CaseStudy, "id">),
      };
    }
  } catch (err) {
    console.warn(`Notice querying case study for slug ${slug}:`, err);
  }

  // Fallback to static catalog
  const found = INITIAL_CASE_STUDIES.find((cs) => cs.slug === slug);
  return found || null;
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
  try {
    const docRef = doc(db, "case-studies", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<CaseStudy, "id">),
      };
    }
  } catch (err) {
    console.warn(`Notice querying case study for ID ${id}:`, err);
  }

  const found = INITIAL_CASE_STUDIES.find((cs) => cs.id === id);
  return found || null;
}

export async function createCaseStudy(data: Partial<CaseStudy>) {
  return await addDoc(caseStudiesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>) {
  const docRef = doc(db, "case-studies", id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });
}

export async function deleteCaseStudy(id: string) {
  const docRef = doc(db, "case-studies", id);
  return await deleteDoc(docRef);
}

export async function seedInitialCaseStudies() {
  const results: string[] = [];

  for (const item of INITIAL_CASE_STUDIES) {
    // Use the existing ID so syncing cannot create duplicates
    const studyRef = doc(caseStudiesRef, item.id);

    const existingStudy = await getDoc(studyRef);

    if (!existingStudy.exists()) {
      const { id, ...studyData } = item;

      await setDoc(studyRef, {
        ...studyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt:
          item.status === "published" ? serverTimestamp() : null,
      });

      results.push(id);
    }
  }

  return results;
}
