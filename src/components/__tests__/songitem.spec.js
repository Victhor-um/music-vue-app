/* eslint-disable no-undef */
import SongItem from '../SongItem.vue'
import { RouterLinkStub, mount } from '@vue/test-utils'

describe('SongItem', () => {
  test('render song.modifiedName', () => {
    const song = {
      modifiedName: 'test'
    }
    const wrapper = mount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-600')

    expect(compositionAuthor.text()).toBe(song.modifiedName)
  })

  test('render song.doID in id attribute', () => {
    const song = {
      docID: 'abc'
    }
    const wrapper = mount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-600')

    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)
    // expect(wrapper.classes()).toContain(`song-id-${song.docID}`)
  })
})
