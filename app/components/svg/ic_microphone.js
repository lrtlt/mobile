import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    {...props}
    className="svg-icon svg-icon-mic"
    width={props.size}
    height={props.size}
    viewBox="0 0 18 18">
    <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G transform="translate(-745.000000, -6535.000000)" fillRule="nonzero">
        <G transform="translate(0.000000, 5840.000000)">
          <G transform="translate(744.000000, 529.000000)">
            <G transform="translate(0.000000, 163.000000)">
              <Path
                fill="#93BDE7"
                d="M5.52525905,7.9748734 L9.52504366,7.9748734 C10.0773284,7.9748734 10.5250437,8.42258865 10.5250437,8.9748734 C10.5250437,9.00116437 10.5240068,9.02744511 10.5219356,9.05365436 L9.65264323,20.0536544 C9.61154064,20.5737653 9.17748378,20.9748734 8.65575128,20.9748734 L6.39455143,20.9748734 C5.87281893,20.9748734 5.43876207,20.5737653 5.39765948,20.0536544 L4.5283671,9.05365436 C4.48485757,8.50308614 4.89590986,8.02149098 5.44647808,7.97798145 C5.47268734,7.97591022 5.49896808,7.9748734 5.52525905,7.9748734 Z"
                transform="translate(7.525126, 14.474873) rotate(45.000000) translate(-7.525126, -14.474873) "
              />
              <Circle
                fill="#BADAFB"
                transform="translate(12.828427, 9.171573) rotate(45.000000) translate(-12.828427, -9.171573) "
                cx={12.8284271}
                cy={9.17157288}
                r={6}
              />
            </G>
          </G>
        </G>
      </G>
    </G>
  </Svg>
);

export default React.memo(SvgComponent);
