/* Khadim.com — indicative 2026 pay data used by the planner, rates table and tools.
   Figures are typical market ranges gathered from public agency rate cards, job boards,
   government minimums and household surveys. They are estimates, not quotes or legal minimums.
   ft  = monthly cash salary for a full-time hire (live-in where that is the norm)
   pt  = hourly rate for part-time help (cleaning baseline; other roles scale from it)
   ex  = monthly employer costs on top of salary, by arrangement (pt / ft / li)
   pay = payroll tax/insurance as a share of salary (countries where that applies)
   refWeek = hours in a standard full-time week used for scaling */
window.KHADIM_RATES = {
  updated: "October 2026",
  roles: {
    clean: "Housekeeping & cleaning",
    cook: "Cooking",
    child: "Childcare / nanny",
    elder: "Elder care",
    drive: "Driving",
    garden: "Gardening",
    pet: "Pet care"
  },
  countries: {
    IN: {
      name: "India", cur: "INR", locale: "en-IN", refWeek: 54, liveinF: 1.05, ftOutF: 1,
      tiers: { metro: ["Metro city (Mumbai, Delhi NCR, Bengaluru…)", 1], tier2: ["Tier-2 city (Pune, Jaipur, Lucknow…)", 0.78], tier3: ["Smaller town", 0.62] },
      ft: { clean: [12000, 20000], cook: [14000, 26000], child: [15000, 30000], elder: [16000, 28000], drive: [18000, 30000], garden: [10000, 16000], pet: [10000, 18000] },
      pt: [80, 140],
      ex: { pt: [0, 300], ft: [600, 1500], li: [3500, 6500] },
      exLabel: { pt: "festival bonus share", ft: "bonus, leave cover, travel", li: "food, room and utilities" },
      notes: [
        "Pay by bank transfer or UPI and keep a simple salary record.",
        "Register the worker on e-Shram and complete police verification where your city requires it.",
        "Budget one month's pay as an annual festival bonus — it is customary across India."
      ]
    },
    AE: {
      name: "UAE", cur: "AED", locale: "en-AE", refWeek: 54, liveinF: 1, ftOutF: 1.55,
      ft: { clean: [1500, 2500], cook: [1800, 3200], child: [2000, 3500], elder: [2500, 4500], drive: [2200, 3800], garden: [1500, 2500], pet: [1500, 2500] },
      pt: [35, 55],
      ex: { pt: [0, 0], ft: [0, 300], li: [800, 1600] },
      exLabel: { pt: "usually included in the hourly rate", ft: "agency packages bundle visa costs", li: "food, visa, insurance, annual ticket" },
      notes: [
        "Hire through a MOHRE-licensed recruitment office or Tadbeer centre. The employer pays all recruitment and government fees.",
        "The law sets a paid weekly rest day, 12 hours' daily rest, 30 days' paid leave and a ticket home every two years.",
        "Pay within 10 days of the due date. The worker keeps their own passport and ID."
      ]
    },
    SA: {
      name: "Saudi Arabia", cur: "SAR", locale: "en-SA", refWeek: 54, liveinF: 1, ftOutF: 1.5,
      ft: { clean: [1500, 2200], cook: [1800, 3000], child: [1800, 3000], elder: [2200, 4000], drive: [1800, 3200], garden: [1400, 2200], pet: [1400, 2200] },
      pt: [30, 45],
      ex: { pt: [0, 0], ft: [0, 300], li: [700, 1300] },
      exLabel: { pt: "usually included in the hourly rate", ft: "agency packages bundle visa costs", li: "food, recruitment, insurance, ticket" },
      notes: [
        "Recruit, contract and transfer through the official Musaned platform.",
        "Since 1 January 2026, domestic workers' salaries must be paid electronically through Musaned.",
        "Rules include 8 hours' unbroken daily rest, a weekly rest day and a month's paid leave every two years."
      ]
    },
    QA: {
      name: "Qatar", cur: "QAR", locale: "en-QA", refWeek: 54, liveinF: 1, ftOutF: 1.5,
      ft: { clean: [1300, 2200], cook: [1600, 2800], child: [1800, 3000], elder: [2000, 3800], drive: [1800, 3000], garden: [1300, 2000], pet: [1300, 2000] },
      pt: [35, 50],
      ex: { pt: [0, 0], ft: [0, 300], li: [700, 1300] },
      exLabel: { pt: "usually included in the hourly rate", ft: "agency packages bundle visa costs", li: "food, housing, visa, ticket" },
      notes: [
        "Qatar's minimum wage of QAR 1,000 covers domestic workers, with food and housing provided on top.",
        "Law No. 15 of 2017 caps work at 10 hours a day and gives a weekly rest day and three weeks' annual leave.",
        "End-of-service pay is at least three weeks' wage per year after 12 months."
      ]
    },
    SG: {
      name: "Singapore", cur: "SGD", locale: "en-SG", refWeek: 54, liveinF: 1, ftOutF: 0, liveInOnly: true,
      ft: { clean: [650, 850], cook: [700, 950], child: [700, 950], elder: [750, 1000], drive: null, garden: [650, 850], pet: [650, 850] },
      pt: [18, 25],
      ex: { pt: [0, 0], ft: [450, 750], li: [450, 750] },
      exLabel: { pt: "usually included in the hourly rate", ft: "levy, insurance, food", li: "levy, insurance, food" },
      notes: [
        "Migrant domestic workers must live at the employer's registered address.",
        "Levy is S$300 a month (S$60 concessionary for homes with young children, elders or a person with disability), plus a S$5,000 bond and medical insurance.",
        "A weekly rest day is the norm, and at least one rest day a month cannot be replaced with pay."
      ]
    },
    HK: {
      name: "Hong Kong", cur: "HKD", locale: "en-HK", refWeek: 54, liveinF: 1, ftOutF: 0, liveInOnly: true,
      ft: { clean: [5220, 5900], cook: [5220, 6500], child: [5220, 6500], elder: [5400, 7000], drive: null, garden: [5220, 5900], pet: [5220, 5900] },
      pt: [110, 160],
      ex: { pt: [0, 0], ft: [1300, 2200], li: [1300, 2200] },
      exLabel: { pt: "usually included in the hourly rate", ft: "food allowance, insurance, agency", li: "food allowance, insurance, agency" },
      notes: [
        "The Minimum Allowable Wage is HK$5,220 for contracts signed on or after 3 October 2026, and helpers must live in.",
        "Use the two-year Standard Employment Contract and give free food or at least HK$1,236 a month food allowance.",
        "Helpers are entitled to a weekly rest day and statutory holidays."
      ]
    },
    UK: {
      name: "United Kingdom", cur: "GBP", locale: "en-GB", refWeek: 40, liveinF: 0.85, ftOutF: 1,
      ft: { clean: [2250, 2950], cook: [2600, 4300], child: [2350, 3300], elder: [2250, 3300], drive: [2400, 3450], garden: [2250, 3100], pet: [2100, 2800] },
      pt: [14, 20],
      pay: [0.08, 0.15],
      exLabel: { pt: "employer NI and pension if above thresholds", ft: "employer NI and pension", li: "employer NI and pension" },
      notes: [
        "Pay at least the National Living Wage and register as an employer with HMRC if pay passes the thresholds.",
        "Auto-enrolment pension duties can apply to household employers.",
        "Live-in workers still need the right to work in the UK — check before the first day."
      ]
    },
    US: {
      name: "United States", cur: "USD", locale: "en-US", refWeek: 40, liveinF: 0.9, ftOutF: 1,
      ft: { clean: [3100, 4850], cook: [3800, 6900], child: [3450, 5200], elder: [3100, 5200], drive: [3450, 5200], garden: [3100, 4850], pet: [2750, 4300] },
      pt: [22, 35],
      pay: [0.08, 0.12],
      exLabel: { pt: "household payroll taxes above the threshold", ft: "Social Security, Medicare, unemployment tax", li: "Social Security, Medicare, unemployment tax" },
      notes: [
        "Household employers who pay above the IRS threshold must withhold and pay Social Security and Medicare (the 'nanny tax').",
        "State minimum wage and overtime rules apply; several states have a Domestic Workers' Bill of Rights.",
        "Verify work authorisation with Form I-9."
      ]
    },
    CA: {
      name: "Canada", cur: "CAD", locale: "en-CA", refWeek: 40, liveinF: 0.9, ftOutF: 1,
      ft: { clean: [3100, 4500], cook: [3450, 6050], child: [3100, 4850], elder: [3300, 5200], drive: [3450, 5200], garden: [3100, 4500], pet: [2750, 4150] },
      pt: [20, 30],
      pay: [0.07, 0.11],
      exLabel: { pt: "CPP, EI and workers' compensation", ft: "CPP, EI and workers' compensation", li: "CPP, EI and workers' compensation" },
      notes: [
        "Household employers register a CRA payroll account and remit CPP, EI and income tax.",
        "Provincial employment standards set minimum wage, overtime and rest — they apply in private homes.",
        "Hiring a foreign caregiver uses federal caregiver programs; check current IRCC rules first."
      ]
    }
  }
};
