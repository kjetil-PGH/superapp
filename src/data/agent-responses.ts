export interface AgentResponse {
  text: string
  source: string
}

export const suggestedQuestions = [
  'Hva er nettoformuen min?',
  'Hva bør jeg gjøre først?',
  'Bør jeg selge bilen?',
  'Hvilket kredittkort passer meg?',
  'Når når jeg Japan-tur-målet?',
  'Hva vet vi ikke sikkert?',
]

export const agentResponses: Record<string, AgentResponse> = {
  'Hva er nettoformuen min?': {
    text: 'Fra din kundemodell akkurat nå:\n\nEiendeler:\n· Bolig Parkveien 22: 3 800 000 kr (Hjemla)\n· Elbil 2022: 280 000 kr (Statens vegvesen)\n· Bankinnskudd: 1 250 000 kr (PSD2)\n\nGjeld:\n· Boliglån DNB 5,8%: 2 050 000 kr\n· Forbrukslån Santander: 38 000 kr\n· Kredittkort: 3 200 kr\n\nNetto: 3 559 800 kr ↑ 270 000 siste år',
    source: 'Gjeldsregisteret · PSD2 · Hjemla · Statens vegvesen',
  },
  'Hva bør jeg gjøre først?': {
    text: 'Basert på din faktiske situasjon – rangert etter effekt per krone:\n\n1. Samlelån (2 050 kr/mnd) – høy effekt, bekreftet data, lav innsats\n2. Si opp Gjensidige reise (290 kr/mnd) – dokumentert, kan gjøres i dag\n3. Abonnementer (568 kr/mnd) – antatt basert på mønster, bekreft selv\n\nStrøm og mobil er allerede i prosess eller lett å gjøre.',
    source: 'Systemmodellen · alle datakilder',
  },
  'Bør jeg selge bilen?': {
    text: 'Elbil 2022 analysert:\n\n· Nåverdi: 280 000 kr\n· Verdfall: ca. 25 000 kr/år\n· Kjørt: 58 000 km\n\nHvis du bruker kollektivt:\nSpart verdfall 25 000 + forsikring 7 000 – Ruter 3 400 = ca. 24 800 kr/år\n\nDatagrunnlag: middels. Jeg vet ikke om du er avhengig av bil på jobb.',
    source: 'Statens vegvesen · Finn.no markedsdata',
  },
  'Hvilket kredittkort passer meg?': {
    text: 'Basert på ditt forbruksmønster:\n\n· Dagligvarer: 6 500 kr/mnd\n· Restaurant: 2 367 kr/mnd\n\nNorwegian Reward eller Coop MasterCard passer best.\n\n⚠ Råd: Refinansier boliglånet først. Et nytt kredittkort kan skape binding til en bank som ikke gir deg det beste lånet.',
    source: 'PSD2-transaksjonsanalyse · nøytral vurdering',
  },
  'Når når jeg Japan-tur-målet?': {
    text: 'Japan-tur 50 000 kr – prognose:\n\n· Nåværende saldo: 34 200 kr (68%)\n· Gjenstår: 15 800 kr\n· Med nåværende sparing: Oktober 2026\n· Med samlelån-besparelse satt av: Juni 2026\n· Med alle besparelser: Mai 2026\n\nDatagrunnlag: bekreftet via sparekonto-transaksjoner.',
    source: 'PSD2 · Sparekonto-historikk',
  },
  'Hva vet vi ikke sikkert?': {
    text: 'Her er det vi er usikre på:\n\n🟡 Antatt (ikke bekreftet):\n· Netflix og Evo-ubruk – vi ser mønster, ikke logg\n· TV-boks-bruk – ingen tilgang til Telenor-logg\n· Abonnementsliste kan mangle tjenester vi ikke fanger\n\n🔴 Ikke kartlagt:\n· Pensjonssaldo\n· Eventuelle andre lån utenfor Gjeldsregisteret\n· Samboers økonomi hvis relevant\n\n✅ Bekreftet:\n· All gjeld (Gjeldsregisteret + PSD2)\n· Boligverdi (Hjemla + Kartverket)\n· Strømforbruk (Elhub)\n· Bilinformasjon (Statens vegvesen)',
    source: 'Systemmodellen · epistemisk transparens',
  },
}
