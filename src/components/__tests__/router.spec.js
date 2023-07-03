import { RouterLinkStub, shallowMount } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

describe('Rouser', () => {
  test('renders router link', () => {
    const song = {
      docID: 'abc'
    }

    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: 'song',
      params: { id: song.docID }
    })
  })
})
