import {CarPlay, ListTemplate} from 'react-native-carplay';
import {fetchCarPodcasts} from '../../api';
import {ListSection} from 'react-native-carplay/lib/interfaces/ListSection';
import {CarPlayPodcastItem} from '../../api/Types';
import CategoryTemplate from '../category/CategoryTemplate';

export const TEMPLATE_ID_PODCASTS = 'lrt-list-template-podcasts';

export class PodcastsTemplate {
  template?: ListTemplate;

  async onItemSelectHandler(item: CarPlayPodcastItem) {
    console.log('### onPodcastSelect', item.id);
    const template = await CategoryTemplate.build(item);
    CarPlay.pushTemplate(template, true);
  }

  async build() {
    const items = await fetchCarPodcasts(1000).then((data) => {
      if (data.items.length) {
        data.items.forEach((item) => {
          item.title = item.title.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
        });
        data.items.sort((a, b) => a.title.localeCompare(b.title));
        return data.items;
      }
      return [];
    });

    const sections = items.reduce<{
      [key: string]: {title: string}[];
    }>((acc, item) => {
      let firstLetter = item.title.charAt(0).toUpperCase();

      if (firstLetter.match(/[0-9]/) !== null) {
        firstLetter = '0-9';
      }

      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {});

    const listSections: ListSection[] = Object.entries(sections).map(([letter, items]) => ({
      header: letter,
      title: letter,
      sectionIndexTitle: letter.charAt(0).toUpperCase(),
      items: items.map((item) => ({
        text: item.title,
      })),
    }));

    if (this.template) {
      this.template.config.onItemSelect = undefined;
    }

    this.template = new ListTemplate({
      id: TEMPLATE_ID_PODCASTS,
      title: 'Radijo laidos',
      tabTitle: 'Laidos',
      tabSystemImageName: 'circle.grid.3x3.fill',
      trailingNavigationBarButtons: [
        {
          id: 'reload',
          type: 'text',
          title: 'Atnaujinti',
        },
      ],
      sections: listSections,
      onItemSelect: async ({index}) => {
        const podcast = items[index];
        this.onItemSelectHandler(podcast);
      },
      backButtonHidden: true,
    });
    return this.template;
  }
}

const instance = new PodcastsTemplate();
export default instance;
