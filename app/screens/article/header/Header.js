import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {FacebookReactions, ScalableText} from '../../../components';
import Styles from './styles';

const articleHeader = (props) => {
  const subtitle = props.subtitle ? (
    <ScalableText style={Styles.subtitle}>{props.subtitle}</ScalableText>
  ) : null;

  const facebookReactions =
    props.facebookReactions && props.facebookReactions > 0 ? (
      <FacebookReactions style={Styles.facebookReactions} count={props.facebookReactions} />
    ) : null;

  return (
    <View style={Styles.root}>
      <View style={Styles.categoryContainer}>
        <ScalableText style={Styles.smallText}>{props.category}</ScalableText>
        <View style={Styles.greyDot} />
        <ScalableText style={Styles.smallText}>{props.date}</ScalableText>
      </View>
      <ScalableText style={Styles.titleText} selectable={true}>
        {props.title}
      </ScalableText>
      {subtitle}
      {facebookReactions}

      <View style={Styles.authorShareContainer}>
        <View style={Styles.authorContainer}>
          <Text style={Styles.smallTextBold}>{props.author}</Text>
          {/* <Text style={Styles.smallText}>{props.date}</Text> */}
        </View>
      </View>
    </View>
  );
};

articleHeader.propTypes = {
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  facebookReactions: PropTypes.string,
  subtitle: PropTypes.string,
  author: PropTypes.string,
};

export default React.memo(articleHeader);
