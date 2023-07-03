const { shallowMount, RouterLinkStub } = require('@vue/test-utils')
import SongItem from '@/components/SongItem.vue'

describe('Snapshots SongItem.vue', () => {
  test('renders correctly', () => {
    const song = {
      docID: 'abc',
      modifiedName: 'test',
      displayName: 'ha',
      commentCount: 5
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

    expect(wrapper.element).toMatchSnapshot()
  })
})
