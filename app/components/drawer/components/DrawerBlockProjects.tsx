import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {MenuItemProjects} from '../../../api/Types';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';

interface Props {
  navigation: DrawerNavigationHelpers;
  projects?: MenuItemProjects;
}

const DrawerBlockProjects: React.FC<Props> = ({projects, navigation}) => {
  if (!projects || !projects.categories || projects.categories.length <= 0) {
    console.log('invalid projects data');
    return null;
  }

  return (
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
  );
};

export default React.memo(DrawerBlockProjects, (prev, next) => checkEqual(prev.projects, next.projects));
