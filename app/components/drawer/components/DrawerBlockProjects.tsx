import {DrawerNavigationProp} from '@react-navigation/drawer';
import React from 'react';
import {Linking, View} from 'react-native';
import {MenuItemProjects} from '../../../api/Types';
import {useTheme} from '../../../Theme';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import Divider from '../../divider/Divider';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';
import {MainStackParamList} from '../../../navigation/MainStack';

interface Props {
  navigation: DrawerNavigationProp<MainStackParamList>;
  projectBlocks?: MenuItemProjects[];
}

const DrawerBlockProjects: React.FC<React.PropsWithChildren<Props>> = ({projectBlocks, navigation}) => {
  const {dim} = useTheme();

  return (
    <>
      {projectBlocks?.map((projects) => {
        if (!projects || !projects.categories || projects.categories.length <= 0) {
          console.log('invalid projects data');
          return null;
        }

        return (
          <View key={projects.name}>
            <Divider
              style={{
                marginHorizontal: dim.drawerPadding * 2,
              }}
            />
            <DrawerCollapsibleBlock title={projects.name}>
              {projects.categories.map((project, i) => (
                <DrawerItem
                  key={`${i}-${project.name}`}
                  text={project.name}
                  onPress={() => {
                    navigation.closeDrawer();
                    Linking.openURL(project.url);
                  }}
                />
              ))}
            </DrawerCollapsibleBlock>
          </View>
        );
      })}
    </>
  );
};

export default React.memo(DrawerBlockProjects, (prev, next) =>
  checkEqual(prev.projectBlocks, next.projectBlocks),
);
