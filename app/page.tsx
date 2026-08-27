import Beneficios from "@/components/Beneficios";
import Cobertura from "@/components/Cobertura";
import ComoEntrar from "@/components/ComoEntrar";
import ComoFunciona from "@/components/ComoFunciona";
import Comparativo from "@/components/Comparativo";
import Contato from "@/components/Contato";
import Contrato from "@/components/Contrato";
import Depoimentos from "@/components/Depoimentos";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Incluso from "@/components/Incluso";
import ParaQuem from "@/components/ParaQuem";
import Portal from "@/components/Portal";
import Riscos from "@/components/Riscos";
import Servico from "@/components/Servico";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Riscos />
        <Comparativo />
        <ComoFunciona />
        <Beneficios />
        <Incluso />
        <Contrato />
        <ParaQuem />
        <Depoimentos />
        <Cobertura />
        <Servico />
        <ComoEntrar />
        <Portal />
        <Faq />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
