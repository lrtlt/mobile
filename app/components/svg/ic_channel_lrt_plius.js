import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const SvgComponent = props => (
  <Svg {...props} className="logo__svg" width={props.size} height={props.size} viewBox="0 0 27 16">
    <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G transform="translate(-308.000000, -828.000000)">
        <G transform="translate(308.000000, 828.000000)">
          <Path
            d="M23.0936805,9.39540828 C23.6302959,9.42636686 24.1833846,9.43573964 24.5816805,9.20946746 C24.9267692,9.01349112 25.188355,8.69528994 25.3183432,8.22229586 C25.4500355,7.74153846 25.4391479,7.13353846 25.1524734,6.81145562 C24.8270769,6.44525444 24.2806154,6.53112426 23.6996923,6.53112426 L23.0936805,9.39540828 Z M22.6848757,5.47588166 C23.3301775,5.4612071 24.5046154,5.41898225 25.096142,5.52302959 C25.7897278,5.64563314 26.260355,6.00984615 26.4733728,6.56795266 C26.8779172,7.6267929 26.4091834,9.35914793 25.3792189,10.0335148 C24.7731124,10.4817041 22.8994083,10.7064615 22.2774911,10.3064615 C22.0639053,10.1689941 21.8361183,9.90333728 21.8524024,9.52236686 C21.8605444,9.32383432 22.3899645,6.89798817 22.4773491,6.48662722 C22.5454201,6.16691124 22.6456805,5.7875503 22.6848757,5.47588166 Z M17.0414201,10.4729575 C17.0658462,10.2080581 17.5626982,7.94410544 17.6614438,7.4820936 C17.7474083,7.07963206 17.8474793,6.30935987 18.0338935,6.02287467 C18.240284,5.70562023 18.7377988,5.42491017 19.3121893,5.50491017 L18.9321657,7.34718236 L20.683645,7.34765573 C20.7916686,7.12034212 20.9899172,5.74415277 21.0965207,5.49610544 L22.3216095,5.49515869 C22.1941775,6.25984508 21.8626272,7.68696934 21.687574,8.51631845 C21.6148639,8.8596084 21.4752189,9.71366757 21.3447574,9.97818828 C21.0675503,10.5380936 20.771503,10.4778806 20.0381538,10.4758924 L20.4692071,8.40441313 L18.6995503,8.4048865 L18.2589349,10.4778806 L17.0414201,10.4729575 Z M5.62722057,0.00956213018 L5.66530156,0.00956213018 C6.07584396,0.0109195752 6.50896713,0.0560764071 6.97230769,0.142011834 C7.3175858,0.206201183 16.9832899,2.27853254 16.9832899,2.27853254 C16.9832899,2.27853254 16.2746509,2.6675503 16.0784852,2.80104142 C15.1748166,3.33254438 14.6286391,3.56989349 13.3761893,3.32733728 L13.360568,3.32695858 L13.3614201,3.32695858 L2.368,1.04018935 L3.48515976,0.513136095 C4.15345146,0.173098971 4.85002532,0.0121424638 5.62722259,0.00956212977 Z"
            fill="#A91B73"
          />
          <Path
            d="M2.75730178,6.75455621 L2.25467456,9.1579645 L4.07299408,9.1579645 L3.81065089,10.4213018 L0.473372781,10.4213018 L1.49585799,5.49112426 L1.74721893,5.49112426 C2.44421302,5.49112426 2.8967574,6.05671006 2.75730178,6.75455621 Z M14.0736568,5.49112426 C13.9291834,6.18376331 13.2550059,6.74518343 12.5628402,6.75323077 C12.5628402,6.75417751 12.5628402,6.75455621 12.5628402,6.75455621 L12.444497,6.75455621 L11.6835976,10.4213018 L11.4329941,10.4213018 C10.7356213,10.4213018 10.2831716,9.85590533 10.4231006,9.1579645 L10.9256331,6.75455621 L9.56213018,6.75455621 C9.70698225,6.06163314 10.3807811,5.50049704 11.0729467,5.49159763 L11.0729467,5.49112426 L14.0736568,5.49112426 Z M7.78272189,5.49112426 C8.69377515,5.49112426 9.39076923,5.74011834 9.39076923,6.78305325 C9.39076923,7.2956213 9.13410651,7.71389349 8.76781065,7.92681657 C8.59256805,8.02887574 8.42726627,8.08056805 8.25486391,8.11540828 L8.25486391,8.12459172 C8.70059172,8.25031953 8.76828402,8.66073373 8.7743432,9.13439053 C8.77718343,9.36463905 8.76743195,9.60842604 8.77074556,9.83138462 C8.77386982,10.0542485 8.79583432,10.276071 8.85973964,10.4213018 L7.42542012,10.4213018 C7.36776331,10.2898935 7.35848521,10.1577278 7.35602367,9.93552663 C7.35308876,9.69098225 7.42390533,9.39020118 7.41983432,9.13921893 C7.41746746,8.90698225 7.25831953,8.72946746 6.92023669,8.70144379 L6.31195266,8.70144379 C6.38513609,8.16927811 6.72,7.75545562 7.23550296,7.6476213 C7.23550296,7.6476213 7.2848284,7.63616568 7.30953846,7.63427219 C7.4076213,7.62007101 7.49311243,7.59507692 7.56468639,7.56014201 C7.77230769,7.46205917 7.87105325,7.28577515 7.87105325,7.09292308 C7.87105325,6.90669822 7.7551716,6.66499408 7.36094675,6.66499408 L6.53888757,6.66499408 L5.75204734,10.4213018 L4.26035503,10.4213018 L5.28284024,5.49112426 L7.78272189,5.49112426 Z M1.10106509,11.2540592 C1.1423432,11.2845444 1.17528994,11.3247811 1.19772781,11.3742959 C1.22092308,11.4238107 1.23228402,11.4848757 1.23228402,11.556071 C1.23228402,11.627645 1.21846154,11.6924024 1.19091124,11.7489231 C1.16402367,11.8053491 1.12615385,11.8539172 1.07891124,11.8925444 C1.03289941,11.9314556 0.978461538,11.9613728 0.917869822,11.9816331 C0.857183432,12.0020828 0.792899408,12.012497 0.728142012,12.012497 L0.418272189,12.012497 L0.326153846,12.4508402 L1.95399252e-14,12.4508402 L0.266698225,11.1715976 L0.779455621,11.1715976 C0.842887574,11.1715976 0.902343195,11.1779408 0.956402367,11.1902485 C1.01140828,11.2029349 1.05978698,11.2240473 1.10106509,11.2540592 Z M0.538508876,11.4367811 L0.474792899,11.7473136 L0.714414201,11.7473136 C0.775100592,11.7473136 0.823384615,11.7321657 0.857656805,11.7017751 C0.890982249,11.6723314 0.907266272,11.6261302 0.907266272,11.5608994 C0.907266272,11.5348639 0.902816568,11.5137515 0.894579882,11.4986036 C0.885585799,11.4827929 0.874698225,11.4710533 0.861254438,11.4627219 C0.84591716,11.4539172 0.828307692,11.4473846 0.809183432,11.4429349 C0.788923077,11.4391479 0.767242604,11.4367811 0.745278107,11.4367811 L0.538508876,11.4367811 Z M1.92056805,11.1715976 L1.7127574,12.168426 L2.30276923,12.168426 L2.24284024,12.4508402 L1.32544379,12.4508402 L1.33273373,12.4169467 L1.59469822,11.1715976 L1.92056805,11.1715976 Z M2.65088757,12.4508402 L2.92137278,11.1715976 L3.24781065,11.1715976 L2.97723077,12.4508402 L2.65088757,12.4508402 Z M4.30220118,11.9182012 L4.45926627,11.1715976 L4.78560947,11.1715976 L4.62901775,11.9161183 C4.61065089,12.0060592 4.58660355,12.0856805 4.55820118,12.1542249 C4.52932544,12.2240947 4.49013018,12.2844024 4.44184615,12.3331598 C4.39375148,12.3811598 4.33353846,12.4185562 4.26357396,12.4434556 C4.19398817,12.4678817 4.10963314,12.4803787 4.01249704,12.4803787 C3.95143195,12.4803787 3.89084024,12.4734675 3.83138462,12.460497 C3.7704142,12.447432 3.71502959,12.4247101 3.66740828,12.3938462 C3.61921893,12.3628876 3.5795503,12.3221775 3.54906509,12.2730414 C3.51857988,12.2230533 3.50295858,12.1611361 3.50295858,12.0886154 C3.50295858,12.056142 3.50589349,12.023858 3.51166864,11.9917633 L3.52889941,11.9019172 L3.68293491,11.1715976 L4.00956213,11.1715976 L3.8455858,11.948213 C3.84246154,11.9608994 3.84009467,11.9747219 3.83715976,11.9893964 C3.83422485,12.004071 3.83233136,12.0174201 3.83072189,12.0300118 C3.82930178,12.0414675 3.82826036,12.052355 3.82826036,12.0610651 C3.82826036,12.0743195 3.83072189,12.0890888 3.83564497,12.1048994 C3.84113609,12.1191006 3.85050888,12.1326391 3.86414201,12.1464615 C3.87900592,12.1601893 3.89907692,12.1724024 3.92454438,12.1822485 C3.95114793,12.1926627 3.98684024,12.1975858 4.02963314,12.1975858 C4.08009467,12.1975858 4.12146746,12.1911479 4.15280473,12.1784615 C4.18272189,12.1655858 4.20667456,12.148355 4.22542012,12.1257278 C4.2452071,12.1032899 4.25988166,12.0747929 4.27010651,12.0418462 C4.28099408,12.0060592 4.29121893,11.9658225 4.30220118,11.9182012 Z M6.05689941,11.6218131 L5.7447574,11.6218131 L5.74523077,11.5929373 C5.74665089,11.5630202 5.74229586,11.5384048 5.73339645,11.5188071 C5.72468639,11.4996829 5.71247337,11.4845349 5.69571598,11.4720379 C5.67952663,11.4598249 5.65888757,11.4512095 5.63531361,11.4456237 C5.59005917,11.4349255 5.53467456,11.4337894 5.48260355,11.4436355 C5.46111243,11.448748 5.44085207,11.4560379 5.42286391,11.4663574 C5.40610651,11.4764876 5.3927574,11.4887953 5.38253254,11.5046059 C5.37278107,11.5191858 5.36823669,11.5379314 5.36823669,11.5611267 C5.36823669,11.5840379 5.3756213,11.6013633 5.39228402,11.6155645 C5.41188166,11.6327953 5.43659172,11.6473752 5.46508876,11.6592095 C5.49405917,11.6714225 5.52492308,11.681174 5.5568284,11.6885586 L5.63768047,11.7068308 C5.68643787,11.7195172 5.73207101,11.7348545 5.77429586,11.7518959 C5.81642604,11.7691267 5.85420118,11.7927006 5.88553846,11.8211977 C5.91753846,11.8500734 5.94319527,11.8854817 5.96023669,11.9273278 C5.97794083,11.9675645 5.98684024,12.0180261 5.98684024,12.0770083 C5.98684024,12.1543574 5.97008284,12.2222391 5.93713609,12.2776237 C5.90532544,12.3326296 5.86310059,12.377316 5.81263905,12.4115882 C5.76189349,12.445671 5.70489941,12.4705704 5.64307692,12.4859077 C5.58229586,12.5014344 5.52047337,12.5094817 5.46016568,12.5094817 C5.28378698,12.5094817 5.14944379,12.4709491 5.05997633,12.3964403 C4.96927811,12.3203219 4.92307692,12.2026415 4.92307692,12.0460497 L4.92307692,12.0180261 L5.23616568,12.0180261 L5.23484024,12.0473752 C5.23285207,12.0857184 5.2368284,12.1181917 5.248,12.1437539 C5.2584142,12.1682746 5.27308876,12.1869255 5.29306509,12.2011267 C5.31379882,12.2158012 5.33945562,12.2266888 5.36871006,12.2336 C5.42078107,12.2451503 5.48260355,12.2502628 5.5460355,12.2344521 C5.57008284,12.2285823 5.59261538,12.2193988 5.61230769,12.2069018 C5.63152663,12.1951622 5.64620118,12.1804876 5.6584142,12.1624048 C5.66977515,12.1450793 5.6751716,12.1246296 5.6751716,12.0989728 C5.6751716,12.0770083 5.66863905,12.0588308 5.65491124,12.0445349 C5.63976331,12.0282509 5.61902959,12.0140497 5.59299408,12.0022154 C5.56563314,11.989529 5.53420118,11.9781681 5.49784615,11.9684166 C5.46063905,11.9581917 5.4232426,11.9473042 5.38499408,11.9359432 C5.34428402,11.9237302 5.30489941,11.9090557 5.26863905,11.8923929 C5.23039053,11.8751622 5.19498225,11.8531977 5.16402367,11.8271622 C5.1315503,11.7999906 5.10560947,11.7657184 5.08648521,11.7259551 C5.06688757,11.6856237 5.05704142,11.6367716 5.05704142,11.5802509 C5.05704142,11.5065941 5.07285207,11.4432568 5.10371598,11.3907125 C5.13410651,11.3390202 5.17491124,11.2969846 5.22395266,11.2645113 C5.27110059,11.2327006 5.32648521,11.2091267 5.38745562,11.1937894 C5.51024852,11.1635882 5.64175148,11.164819 5.75413018,11.1937894 C5.81311243,11.2091267 5.86508876,11.2341207 5.90977515,11.2681089 C5.95502959,11.3027598 5.99119527,11.3475409 6.01723077,11.4003693 C6.04373964,11.4540497 6.05689941,11.5188071 6.05689941,11.5934107 L6.05689941,11.6218131 Z M16.4410888,3.08014201 C16.6424615,2.95450888 17.2587929,2.59597633 17.2587929,2.59597633 L14.9948402,13.247432 L14.9944615,13.247432 L14.9897278,13.2611598 C14.7011598,14.5045207 14.2625325,14.9065089 13.4095148,15.5157396 L13.4095148,15.516497 C13.2071953,15.6410888 12.5919053,16 12.5919053,16 C12.5919053,16 14.7756686,5.72175148 14.8297278,5.46802367 C15.1167811,4.11730178 15.5573018,3.7112426 16.4410888,3.08014201 Z"
            fill="#721F47"
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default React.memo(SvgComponent);
