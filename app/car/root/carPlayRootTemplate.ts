import {ListTemplate} from 'react-native-carplay';

export type CarRootNavigation = {
  openLiveChannels: () => void;
  openNewest: () => void;
};

const createCarPlayRootTemplate = (callbacks: CarRootNavigation) => {
  return new ListTemplate({
    title: 'LRT.lt',
    id: 'lrt-root-template',
    backButtonHidden: true,
    sections: [
      {
        // header: 'Lrt.lt',
        items: [
          {
            text: 'Tiesiogiai',
          },
          {
            text: 'Naujausi',
          },
        ],
      },
    ],
    onItemSelect: async ({index}) => {
      console.log('Root template onItemSelect', index);
      switch (index) {
        case 0:
          //Tiesiogiai
          callbacks.openLiveChannels();
          break;
        case 1:
          //Naujausi
          callbacks.openNewest();
          break;
      }
    },
  });
};

export default createCarPlayRootTemplate;
