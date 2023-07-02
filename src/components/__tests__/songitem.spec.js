/* eslint-disable no-undef */
import SongItem from '../SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('SongItem', () => {
  test('render song.modifiedName', () => {
    const song = {
      modifiedName: 'test'
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
    expect(wrapper.text()).toContain(song.modifiedName)
  })
})
