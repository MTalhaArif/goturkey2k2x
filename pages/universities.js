import Head from "next/head";

export default function Universities() {
  const universities = [
    {
      name: "Koç University",
      departments: ["Medicine", "Engineering (Computer, Mechanical, Industrial, Electrical)", "Law", "Business Administration", "Economics", "Psychology", "International Relations", "Nursing"],
    },
    {
      name: "Sabancı University",
      departments: ["Computer Science and Engineering", "Mechatronics", "Molecular Biology, Genetics and Bioengineering", "Management", "Economics", "Visual Arts and Visual Communication Design"],
    },
    {
      name: "Bahçeşehir University (BAU)",
      departments: ["Medicine", "Dentistry", "Pharmacy", "Computer Engineering", "Software Engineering", "Artificial Intelligence", "Architecture", "Law", "Business Administration", "Pilotage"],
    },
    {
      name: "Istanbul Bilgi University",
      departments: ["Law", "Psychology", "Business Administration", "Media and Communication", "Computer Engineering", "Architecture", "International Relations", "Gastronomy"],
    },
    {
      name: "Özyeğin University",
      departments: ["Aviation and Aeronautics (Pilotage)", "Computer Science", "Business Administration", "Law", "Architecture", "Gastronomy and Culinary Arts", "Psychology"],
    },
    {
      name: "Yeditepe University",
      departments: ["Medicine", "Dentistry", "Pharmacy", "Law", "Engineering (Genetics, Computer, Civil)", "Architecture", "Fine Arts", "Business Administration", "E-commerce"],
    },
    {
      name: "Medipol University",
      departments: ["Medicine (English and Turkish)", "Dentistry", "Pharmacy", "Nursing", "Physiotherapy", "Biomedical Engineering", "Law", "Business Administration"],
    },
    {
      name: "Istanbul Aydın University",
      departments: ["Medicine", "Dentistry", "Engineering (Software, Computer)", "Aviation Management", "Architecture", "Graphic Design", "Business Administration", "Psychology"],
    },
    {
      name: "Altınbaş University",
      departments: ["Medicine", "Dentistry", "Pharmacy", "Law", "Computer Engineering", "Software Engineering", "Business Administration", "International Trade", "Architecture"],
    },
    {
      name: "Okan University",
      departments: ["Medicine", "Dentistry", "Pilotage", "Automotive Engineering", "Computer Engineering", "Business Administration", "Gastronomy", "Law", "Architecture"],
    },
    {
      name: "Gelişim University",
      departments: ["Dentistry", "Engineering (Computer, Civil, Mechatronics)", "Aviation (Pilotage)", "Architecture", "Psychology", "Business Administration", "Gastronomy"],
    },
    {
      name: "Kadir Has University",
      departments: ["Computer Engineering", "Bioinformatics and Genetics", "Law", "Business Administration", "Public Relations and Information", "Architecture", "Theatre"],
    },
    {
      name: "Beykent University",
      departments: ["Medicine", "Dentistry", "Law", "Computer Engineering", "Software Engineering", "Architecture", "Business Administration", "Psychology"],
    },
    {
      name: "Nişantaşı University",
      departments: ["Medicine", "Dentistry", "Engineering", "Aviation Management", "Psychology", "Architecture", "Gastronomy", "New Media"],
    },
    {
      name: "Işık University",
      departments: ["Computer Engineering", "Software Engineering", "Mechatronics Engineering", "Architecture", "Business Administration", "Psychology", "Visual Communication Design"],
    }
  ];

  return (
    <>
      <Head>
        <title>Private Universities in Istanbul | GoTurkey 2k2x</title>
      </Head>
      
      <div className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2>Private Universities in Istanbul</h2>
            <p>Explore top-tier private institutions offering world-class education, modern campuses, and globally recognized degrees.</p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {universities.map((uni, index) => (
              <div key={index} style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderLeft: "4px solid var(--primary)" }}>
                <h3 style={{ color: "var(--secondary)", fontSize: "1.5rem", marginBottom: "1rem" }}>{uni.name}</h3>
                <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>Available Departments / Faculties:</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {uni.departments.map((dept, i) => (
                    <span key={i} style={{ background: "var(--bg-color)", padding: "8px 12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      {dept}
                    </span>
                  ))}
                  <span style={{ background: "var(--bg-color)", padding: "8px 12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-muted)", border: "1px solid var(--border)", fontStyle: "italic" }}>
                    + Many more associate and undergraduate programs...
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
