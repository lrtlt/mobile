import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {View} from 'react-native';
import {MenuItemProjects} from '../../../api/Types';
import {useTheme} from '../../../Theme';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import Divider from '../../divider/Divider';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';

interface Props {
  navigation: DrawerNavigationHelpers;
  projectBlocks?: MenuItemProjects[];
}

const DrawerBlockProjects: React.FC<Props> = ({projectBlocks, navigation}) => {
  const {dim} = useTheme();

  return (
    <>
      {projectBlocks?.map((projects) => {
        if (!projects || !projects.categories || projects.categories.length <= 0) {
          console.log('invalid projects data');
          return null;
        }

        return (
          <View>
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
                    navigation.navigate('WebPage', {
                      url: project.url,
                      title: project.name,
                    });
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
