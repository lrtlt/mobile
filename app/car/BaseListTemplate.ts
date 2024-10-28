import {AlertTemplate, CarPlay, ListTemplate} from 'react-native-carplay';
import {PlayListItem} from './types';
import TrackPlayer, {PitchAlgorithm} from 'react-native-track-player';
import {carPlayNowPlayingTemplate} from './nowPlaying/createNowPlayingTemplate';
import {strings} from '../Theme';

export type PlaylistProvider = () => Promise<PlayListItem[]>;

export type BaseListTemplateOptions = {
  title: string;
  tabTitle: string;
  tabSystemImageName: string;
  id: string;
};

const streamWarningAlert = new AlertTemplate({
  id: 'stream-blocked-alert',
  onActionButtonPressed: async (_) => {
    CarPlay.dismissTemplate();
  },
  titleVariants: [strings.stream_blocked_warning],
  actions: [
    {
      id: 'close',
      title: 'Uždaryti',
    },
  ],
});

export class BaseListTemplate {
  playlistProvider: PlaylistProvider;
  options: BaseListTemplateOptions;
  template?: ListTemplate;

  constructor(options: BaseListTemplateOptions, playlistProvider: PlaylistProvider) {
    this.options = options;
    this.playlistProvider = playlistProvider;
  }

  async onItemSelectHandler(item: PlayListItem, allItems: PlayListItem[]) {
    console.log('### onItemSelect', item.id);

    if (item.isDisabled) {
      CarPlay.presentTemplate(streamWarningAlert);
      return;
    }
    const index = allItems.indexOf(item);

    await TrackPlayer.setQueue(
      allItems.map((item) => ({
        url: item.streamUrl,
        artwork: item.imgUrl,
        title: item.text,
        pitchAlgorithm: PitchAlgorithm.Voice,
        isLiveStream: item.isLiveStream,
      })),
    );
    await TrackPlayer.skip(index);
    await TrackPlayer.play();

    CarPlay.pushTemplate(carPlayNowPlayingTemplate, true);
  }

  async build() {
    const items = await this.playlistProvider();

    if (this.template) {
      this.template.config.onItemSelect = undefined;
    }

    this.template = new ListTemplate({
      ...this.options,
      trailingNavigationBarButtons: [
        {
          id: 'reload',
          type: 'text',
          title: 'Atnaujinti',
        },
      ],
      sections: [
        {
          items:
            items?.map((item) => ({
              text: item.text,
              detailText: item.detailText,
              imgUrl: item.imgUrl as any,
            })) ?? [],
        },
      ],
      onItemSelect: async ({index}) => {
        this.onItemSelectHandler(items![index], items!);
      },
      backButtonHidden: true,
    });
    return this.template;
  }
}
