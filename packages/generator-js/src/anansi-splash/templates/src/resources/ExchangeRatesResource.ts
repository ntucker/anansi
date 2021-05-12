import { Resource, RestEndpoint, RestFetch } from '@rest-hooks/rest';

// Visit https://resthooks.io/docs/guides/resource-types to read more about these definitions
export default class ExchangeRatesResource extends Resource {
  readonly currency: string = 'USD';
  readonly rates: Record<string, string> = {};

  pk(): string {
    return this.currency;
  }

  static urlRoot = 'https://www.coinbase.com/api/v2/exchange-rates';

  static getEndpointExtra() {
    return { pollFrequency: 15000 };
  }

  static list<T extends typeof Resource>(
    this: T,
  ): RestEndpoint<RestFetch<{ currency: string }>, { data: T }, undefined> {
    return super.list().extend({
      schema: { data: this },
    });
  }
}

export const listMock = [
  {
    request: ExchangeRatesResource.list(),
    params: {
      currency: 'USD',
    },
    result: {
      data: {
        currency: 'USD',
        rates: {
          AED: '3.6732',
          AFN: '77.362936',
          ALL: '101.617717',
          AMD: '521.992653',
          ANG: '1.794046',
          AOA: '654.274',
          ARS: '94.0057',
          AUD: '1.295',
          AWG: '1.8',
          AZN: '1.700805',
          BAM: '1.619939',
          BBD: '2',
          BDT: '84.705082',
          BGN: '1.618886',
          BHD: '0.376991',
          BIF: '1974.491562',
          BMD: '1',
          BND: '1.334598',
          BOB: '6.901326',
          BRL: '5.3093',
          BSD: '1',
          BTN: '73.538673',
          BWP: '10.678272',
          BYN: '2.53208',
          BYR: '25320.8',
          BZD: '2.014324',
          CAD: '1.217525',
          CDF: '1987.733982',
          CHF: '0.905561',
          CLF: '0.025648',
          CLP: '707.699372',
          CNY: '6.4455',
          COP: '3745.915943',
          CRC: '616.074239',
          CUC: '1',
          CVE: '91.6',
          CZK: '21.0915',
          DJF: '177.928269',
          DKK: '6.154202',
          DOP: '56.74051',
          DZD: '133.409852',
          EGP: '15.6554',
          ERN: '15.001997',
          ETB: '42.675253',
          EUR: '0.827558',
          FJD: '2.03545',
          FKP: '0.71204',
          GBP: '0.71204',
          GEL: '3.42',
          GHS: '5.761926',
          GIP: '0.71204',
          GMD: '51.2',
          GNF: '9854.798937',
          GTQ: '7.708902',
          GYD: '209.106825',
          HKD: '7.76755',
          HNL: '23.996521',
          HRK: '6.2285',
          HTG: '87.209274',
          HUF: '295.306141',
          IDR: '14319.4',
          ILS: '3.2866',
          INR: '73.4555',
          IQD: '1458.223629',
          ISK: '124.54',
          JMD: '150.8219',
          JOD: '0.709',
          JPY: '109.58',
          KES: '107.04',
          KGS: '84.716651',
          KHR: '4059.869633',
          KMF: '408.049838',
          KRW: '1129.651318',
          KWD: '0.300924',
          KYD: '0.832916',
          KZT: '428.63131',
          LAK: '9420.207645',
          LBP: '1507.186729',
          LKR: '196.894021',
          LRD: '171.82506',
          LSL: '14.148955',
          LYD: '4.462369',
          MAD: '8.876955',
          MDL: '17.720913',
          MGA: '3763.869645',
          MKD: '51.011746',
          MMK: '1556.678324',
          MNT: '2850.956548',
          MOP: '7.99634',
          MRO: '356.999828',
          MUR: '40.703474',
          MVR: '15.43',
          MWK: '795.647777',
          MXN: '19.924421',
          MYR: '4.1255',
          MZN: '58.876002',
          NAD: '14',
          NGN: '408.532698',
          NIO: '34.906898',
          NOK: '8.347512',
          NPR: '117.663884',
          NZD: '1.393782',
          OMR: '0.384972',
          PAB: '1',
          PEN: '3.71657',
          PGK: '3.554372',
          PHP: '47.797914',
          PKR: '151.834491',
          PLN: '3.745643',
          PYG: '6680.915437',
          QAR: '3.641',
          RON: '4.0783',
          RSD: '97.386983',
          RUB: '74.1255',
          RWF: '1000.629364',
          SAR: '3.751103',
          SBD: '7.977694',
          SCR: '15.425596',
          SEK: '8.395597',
          SHP: '0.71204',
          SLL: '10237.50014',
          SOS: '578.1964',
          SRD: '14.154',
          SSP: '130.26',
          STD: '20736.892254',
          SVC: '8.745699',
          SZL: '14.149466',
          THB: '31.325979',
          TJS: '11.398878',
          TMT: '3.51',
          TND: '2.7375',
          TOP: '2.257137',
          TRY: '8.506',
          TTD: '6.784009',
          TWD: '27.963501',
          TZS: '2317.807233',
          UAH: '27.619562',
          UGX: '3538.919969',
          UYU: '44.078066',
          UZS: '10545.247422',
          VES: '2844317.178571',
          VND: '23049',
          VUV: '108.218608',
          WST: '2.51332',
          XAF: '542.842251',
          XAG: '0.03711953',
          XAU: '0.00054863',
          XCD: '2.70255',
          XDR: '0.695161',
          XOF: '542.842251',
          XPD: '0.0003469',
          XPF: '98.753899',
          XPT: '0.00082103',
          YER: '249.850102',
          ZAR: '14.13075',
          ZMW: '22.374747',
          JEP: '0.71204',
          GGP: '0.71204',
          IMP: '0.71204',
          GBX: '8.368370305072286',
          CNH: '6.446777',
          MTL: '0.287660216672579',
          ZWL: '322',
          SGD: '1.3353',
          USD: '1.0',
          BTC: '2.0242681410356197e-05',
          BCH: '0.0008042787630192625',
          BSV: '0.003175479935097379',
          ETH: '0.00026281208935611036',
          ETH2: '0.00026281208935611036',
          ETC: '0.01125809175344779',
          LTC: '0.003189792663476874',
          ZRX: '0.6173407307215294',
          USDC: '1.0',
          BAT: '0.842212357108146',
          MANA: '0.7974599306289606',
          KNC: '0.3308191081116845',
          LINK: '0.022795792215898038',
          DNT: '3.7190966314282257',
          MKR: '0.00020514357301186953',
          CVC: '2.148587733282913',
          OMG: '0.10027073097362879',
          DAI: '0.9992700332407177',
          ZEC: '0.003423426507591448',
          REP: '0.025332488917036097',
          XLM: '1.4679351583681846',
          EOS: '0.09225517782185526',
          XTZ: '0.16352026424874702',
          ALGO: '0.7320912185658333',
          DASH: '0.0027782292400292826',
          ATOM: '0.04200709919976476',
          OXT: '1.7930787161556394',
          COMP: '0.0012950264509152601',
          ENJ: '0.4814636494944632',
          BAND: '0.0673573035524242',
          NMR: '0.01752487436855687',
          CGLD: '0.22511368240961688',
          UMA: '0.0398263570831176',
          LRC: '1.6421709499958945',
          YFI: '1.4918600757581467e-05',
          UNI: '0.026239074705269594',
          BAL: '0.016458578120394172',
          REN: '1.2201818070892563',
          WBTC: '2.0230524807124707e-05',
          NU: '2.4000960038401535',
          FIL: '0.0086706242285854',
          AAVE: '0.0019148302646582649',
          BNT: '0.13930680931683942',
          GRT: '0.7566585956416464',
          SNX: '0.04998512942399636',
          STORJ: '0.5821738371077604',
          SUSHI: '0.06672894701721606',
          MATIC: '0.8757717738757279',
          SKL: '2.0',
          ADA: '0.5299276648737448',
          ANKR: '7.332453438920663',
          CRV: '0.29570051451889523',
          ICP: '0.0030246935985384677',
          NKN: '1.8811136192626037',
          OGN: '0.7344840249724569',
          '1INCH': '0.1790670606142',
          USDT: '0.9992505620784411',
          FORTH: '0.031666112509697746',
          CTSI: '0.9005499217102423',
          TRB: '0.009556894582674306',
          MIR: '0.12440905697934809',
          RLC: '0.11905470563724031',
        },
      },
    },
  },
];
