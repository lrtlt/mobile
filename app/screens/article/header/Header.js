import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {FacebookReactions, Text} from '../../../components';
import {useTheme} from '../../../Theme';

const ArticleHeader = (props) => {
  const {colors} = useTheme();

  const subtitle = props.subtitle ? (
    <Text style={styles.subtitle} type="error">
      {props.subtitle}
    </Text>
  ) : null;

  const facebookReactions =
    props.facebookReactions && props.facebookReactions > 0 ? (
      <FacebookReactions style={styles.facebookReactions} count={props.facebookReactions} />
    ) : null;

  return (
    <View style={styles.root}>
      <View style={styles.categoryContainer}>
        <Text style={styles.smallText}>{props.category}</Text>
        <View style={{...styles.greyDot, backgroundColor: colors.buttonContent}} />
        <Text style={styles.smallText}>{props.date}</Text>
      </View>
      <Text style={styles.titleText} selectable={true}>
        {props.title}
      </Text>
      {subtitle}
      {facebookReactions}

      <View style={styles.authorShareContainer}>
        <View style={styles.authorContainer}>
          <Text style={styles.smallTextBold}>{props.author}</Text>
          {/* <Text style={styles.smallText}>{props.date}</Text> */}
        </View>
      </View>
    </View>
  );
};

ArticleHeader.propTypes = {
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  facebookReactions: PropTypes.string,
  subtitle: PropTypes.string,
  author: PropTypes.string,
};

export default ArticleHeader;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  categoryContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    flexDirection: 'row',
  },
  facebookReactions: {
    marginTop: 8,
  },
  smallText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
  },
  smallTextBold: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
  },
  authorShareContainer: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flex: 1,
  },
  greyDot: {
    width: 4,
    height: 4,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 2,
    borderRadius: 2,
  },
  titleText: {
    marginTop: 24,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 25,
  },
  subtitle: {
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 4,
    fontSize: 15,
  },
});
