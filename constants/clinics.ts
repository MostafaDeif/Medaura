export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  price: number;
  imageSrc: string;
  rating: number;
  gender: "male" | "female";
}

export interface Review {
  id: number;
  name: string;
  date: string;
  comment: string;
  rating: number;
}

export interface Clinic {
  id: number;
  name: string;
  city: string;
  phone: string;
  rating: number;
  hours: string;
  specialties: string[];
  image: string;
  doctors: Doctor[];
  reviews: Review[];
}

export const allClinics: Clinic[] = Array.from({ length: 18 }).map((_, index) => {
  const clinicId = index + 1;
  const type = index % 3;
  
  let name = "";
  let specialties: string[] = [];
  let image = "";
  
  if (type === 0) {
    name = "مركز القلب الطبي";
    specialties = ["أمراض القلب", "جراحة القلب", "قسطرة"];
    image = "/images/clinic1.png";
  } else if (type === 1) {
    name = "مستشفى النور التخصصي";
    specialties = ["باطنة", "جراحة عامة", "طوارئ"];
    image = "/images/clinic2.png";
  } else {
    name = "عيادة العظام المتقدمة";
    specialties = ["عظام", "علاج طبيعي", "روماتيزم"];
    image = "/images/clinic3.png";
  }

  return {
    id: clinicId,
    name,
    city: "القاهرة",
    phone: "+201134569034",
    rating: 4.9,
    hours: "السبت - الخميس 8 ص - 10 م",
    specialties,
    image,
    doctors: [
      {
        id: 1,
        name: "د. صالح محمود",
        specialty: specialties[0],
        experience: 8,
        price: 350,
        imageSrc: "/images/doc1.jpg",
        rating: 4.9,
        gender: "male",
      },
      {
        id: 2,
        name: "د. نادين عادل",
        specialty: specialties[1] || specialties[0],
        experience: 7,
        price: 280,
        imageSrc: "/images/doc3.jpg",
        rating: 4.9,
        gender: "female",
      },
      {
        id: 3,
        name: "د. كريم محمد",
        specialty: specialties[2] || specialties[0],
        experience: 10,
        price: 320,
        imageSrc: "/images/doc2.jpg",
        rating: 4.8,
        gender: "male",
      },
    ],
    reviews: Array.from({ length: 3 }).map((_, i) => ({
      id: i + 1,
      name: "محمد أ. م ٣٨ سنة",
      date: "الثلاثاء، ٣٠ ديسمبر ٢٠٢٥ ٩:٣٠ ص",
      comment: "محتررم و فاهم",
      rating: 5,
    })),
  };
});
