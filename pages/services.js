import Head from "next/head";
import Reveal from "@/components/Reveal";

export default function Services() {
  const services = [
    { title: "University Admissions", desc: "Guaranteed acceptance in top Turkish universities." },
    { title: "Visa Assistance", desc: "Guidance through the entire student visa process." },
    { title: "Airport Pickup", desc: "Safe and comfortable transfer from the airport to your accommodation." },
    { title: "Accommodation Drop", desc: "Assistance in finding and settling into your new home." },
    { title: "University Registration", desc: "Help with the final registration steps at your university." },
    { title: "Student SIM & Transport Card", desc: "Get connected and mobile from day one." },
    { title: "Residency Registration", desc: "Full support in obtaining your Turkish residence permit." },
    { title: "Bank Account Opening", desc: "Assistance in setting up your local finances." },
  ];

  return (
    <>
      <Head>
        <title>Our Services | GoTurkey 2k2x</title>
      </Head>
      <div className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>Post-Landing & Academic Services</h2>
            <p>We ensure you are comfortable and ready to focus on your studies from the moment you arrive in Turkey.</p>
          </Reveal>
          <div className="grid-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 90}>
                <div className="card">
                  <h3 className="card-title">{s.title}</h3>
                  <p className="card-text">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
