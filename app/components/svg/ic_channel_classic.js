import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const SvgComponent = props => (
  <Svg {...props} className="logo__svg" width={props.size} height={props.size} viewBox="0 0 18 16">
    <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G transform="translate(-1164.000000, -828.000000)">
        <G transform="translate(1164.000000, 828.000000)">
          <Path
            d="M13.3178592,3.29014085 L13.3331831,3.2903662 C14.5723944,3.5303662 15.1125634,3.29532394 16.0065352,2.76980282 C16.2005634,2.63774648 16.9016338,2.25261972 16.9016338,2.25261972 C16.9016338,2.25261972 7.34016901,0.202816901 6.99853521,0.139492958 C5.65521127,-0.109746479 4.56878873,-0.0123943662 3.54907042,0.506591549 L2.44371831,1.02760563 L13.3187606,3.29014085 L13.3178592,3.29014085"
            fill="#C47FAA"
          />
          <Path
            d="M16.3652958,3.04585915 C16.5642817,2.92169014 17.1740845,2.56698592 17.1740845,2.56698592 L14.9345352,13.1035493 L14.9343099,13.1035493 L14.9293521,13.1170704 C14.6440563,14.3468169 14.2100282,14.7447887 13.3663099,15.3473803 L13.3663099,15.3482817 C13.1661972,15.472 12.5575211,15.8267042 12.5575211,15.8267042 C12.5575211,15.8267042 14.7177465,5.65904225 14.7711549,5.408 C15.0550986,4.07166197 15.4909296,3.66985915 16.3652958,3.04585915 Z M7.78861972,5.38073239 C8.69002817,5.38073239 9.37960563,5.62726761 9.37960563,6.65892958 C9.37960563,7.16597183 9.1256338,7.57971831 8.7628169,7.79064789 C8.58997183,7.89183099 8.42614085,7.94253521 8.25532394,7.97723944 L8.25532394,7.98647887 C8.69656338,8.11064789 8.76326761,8.51673239 8.76957746,8.98523944 C8.77250704,9.21261972 8.76259155,9.45397183 8.76597183,9.6743662 C8.76890141,9.89498592 8.79098592,10.1144789 8.85408451,10.2584789 L7.43526761,10.2584789 C7.37825352,10.1282254 7.36901408,9.99752113 7.36653521,9.77735211 C7.36338028,9.53577465 7.43369014,9.23830986 7.4296338,8.98997183 C7.42715493,8.76011268 7.2696338,8.58456338 6.93543662,8.55684507 L6.33329577,8.55684507 C6.4056338,8.03042254 6.73735211,7.6211831 7.24709859,7.51414085 C7.24709859,7.51414085 7.296,7.50309859 7.32033803,7.50107042 C7.41746479,7.48687324 7.50197183,7.46230986 7.57295775,7.42783099 C7.77825352,7.33070423 7.87628169,7.15628169 7.87628169,6.96540845 C7.87628169,6.78129577 7.76112676,6.54197183 7.37149296,6.54197183 L6.55774648,6.54197183 L5.77983099,10.2584789 L4.30377465,10.2584789 L5.31515493,5.38073239 L7.78861972,5.38073239 Z M14.0401127,5.38073239 C13.8974648,6.06602817 13.2304225,6.62152113 12.5455775,6.62940845 L12.5455775,6.63076056 L12.4283944,6.63076056 L11.6757183,10.2584789 L11.427831,10.2584789 C10.7380282,10.2584789 10.2904789,9.69892958 10.4290704,9.0084507 L10.9261972,6.63076056 L9.57701408,6.63076056 C9.72033803,5.94501408 10.3869296,5.38997183 11.0715493,5.3811831 L11.0715493,5.38073239 L14.0401127,5.38073239 Z M2.79729577,6.63076056 L2.30039437,9.0084507 L4.09892958,9.0084507 L3.83977465,10.2584789 L0.537690141,10.2584789 L1.54929577,5.38073239 L1.7976338,5.38073239 C2.48743662,5.38073239 2.93543662,5.94028169 2.79729577,6.63076056 Z M1.21126761,11.2953239 L1.60788732,11.2953239 L1.01814085,11.7807324 L1.42107042,12.5029859 L1.02287324,12.5029859 L0.750873239,11.9806197 L0.548507042,12.1444507 L0.481577465,12.5029859 L0.187042254,12.5029859 L0.411943662,11.2953239 L0.706704225,11.2953239 L0.609577465,11.8147606 L1.21126761,11.2953239 Z M1.93870423,11.2953239 L2.23369014,11.2953239 L2.05273239,12.2632113 L2.71391549,12.2632113 L2.66974648,12.5029859 L1.71380282,12.5029859 L1.93870423,11.2953239 Z M3.75752113,11.555831 L3.49769014,12.0347042 L3.83819718,12.0347042 L3.75752113,11.555831 Z M3.87628169,12.2544225 L3.37757746,12.2544225 L3.24394366,12.5029859 L2.92619718,12.5029859 L3.62839437,11.2953239 L3.984,11.2953239 L4.23616901,12.5029859 L3.91864789,12.5029859 L3.87628169,12.2544225 Z M5.42850704,11.6457465 C5.44067606,11.488 5.30546479,11.4713239 5.18828169,11.4713239 C5.0668169,11.4713239 4.97847887,11.532169 4.96180282,11.6135211 C4.9496338,11.6790986 4.99222535,11.7129014 5.06523944,11.7266479 L5.42242254,11.7926761 C5.61239437,11.8282817 5.74760563,11.9094085 5.70659155,12.1311549 C5.66715493,12.3542535 5.4936338,12.5370141 5.0668169,12.5370141 C4.80225352,12.5370141 4.46647887,12.5000563 4.53340845,12.1228169 L4.8644507,12.1228169 C4.83583099,12.2900282 4.9816338,12.3172958 5.10783099,12.3172958 C5.24777465,12.3172958 5.34940845,12.2733521 5.36923944,12.1663099 C5.38591549,12.071662 5.32371831,12.0498028 5.21126761,12.0277183 L4.95121127,11.9819718 C4.76890141,11.9497465 4.59560563,11.8873239 4.64428169,11.640338 C4.69453521,11.371493 4.9115493,11.2615211 5.25205634,11.2615211 C5.47560563,11.2615211 5.79785915,11.303662 5.75526761,11.6457465 L5.42850704,11.6457465 Z M6.25419718,11.2953239 L6.5491831,11.2953239 L6.32405634,12.5029859 L6.02929577,12.5029859 L6.25419718,11.2953239 Z M7.80484507,11.2953239 L8.20169014,11.2953239 L7.61194366,11.7807324 L8.01487324,12.5029859 L7.6164507,12.5029859 L7.3444507,11.9806197 L7.14230986,12.1444507 L7.07538028,12.5029859 L6.78061972,12.5029859 L7.00552113,11.2953239 L7.30050704,11.2953239 L7.20315493,11.8147606 L7.80484507,11.2953239 Z M9.0715493,11.555831 L8.81171831,12.0347042 L9.15222535,12.0347042 L9.0715493,11.555831 Z M9.19030986,12.2544225 L8.69160563,12.2544225 L8.55797183,12.5029859 L8.24022535,12.5029859 L8.94242254,11.2953239 L9.29802817,11.2953239 L9.55042254,12.5029859 L9.23267606,12.5029859 L9.19030986,12.2544225 Z"
            fill="#441D56"
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default React.memo(SvgComponent);
