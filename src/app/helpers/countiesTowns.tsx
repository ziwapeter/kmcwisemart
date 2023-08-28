const addCommas = (num: any) => num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';


export const groupedOptions = [
  {
    label: 'KIAMBU',
    value: 'KIAMBU',
    options: [
      {
        label: 'BTL AREA' + " - " + `(${addCommas((150).toFixed(2)) + ' ' + process.env.currency})`,
        value: { county: 'KIAMBU', town: 'BTL AREA', transport: 150 }
        
      },
      {
        label: 'MEMBLEY' + " - " + `(${addCommas((150).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'MEMBLEY' , transport: 150}
        
      },
      {
        label: 'RUIRU PRISONS' + " - " + `(${addCommas((150).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'RUIRU PRISONS',transport: 150 }
        
      },
      {
        label: 'RUIRU TOWN'  + " - " + `(${addCommas((250).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'RUIRU TOWN',transport: 250 }
        
      },
      {
        label: 'KAMITI CORNER'  + " - " + `(${addCommas((250).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'KAMITI CORNER', transport: 250}
        
      },
      {
        label: 'KAHAWA WEST'  + " - " + `(${addCommas((250).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'KAHAWA WEST',transport: 250 }
        
      },
      {
        label: 'BAMBOO ESTATE'  + " - " + `(${addCommas((250).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'BAMBOO ESTATE',transport: 250 }
        
      },
      {
        label: 'KIRIGITI'  + " - " + `(${addCommas((300).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'KIRIGITI', transport: 300 }
        
      },
      {
        label: 'KIAMBU TOWN'   + " - " + `(${addCommas((200).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'KIAMBU TOWN' , transport: 200}
       
      },
      {
        label: 'OJ'   + " - " + `(${addCommas((150).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'OJ', transport: 150 }
        
      },
      {
        label: 'TATU AREA'   + " - " + `(${addCommas((150).toFixed(2)) + ' '+ process.env.currency})`,
        value: { county: 'KIAMBU', town: 'TATU AREA', transport: 150 }
        
      },
      {
        label: 'OTHERS - (NEGOTIABLE)',
        value: { county: 'KIAMBU', town: 'OTHERS', transport: "NEGOTIABLE"},
        
      },
      // more towns...
    ],
  },
  // more counties...
];
