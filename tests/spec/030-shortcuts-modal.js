import {
  composeButton, composeModalInput, composeModalPostPrivacyButton,
  getMediaScrollLeft,
  getNthStatusMediaButton, getNthStatusOptionsButton,
  modalDialog, scrollToStatus, sleep, visibleModalDialog
} from '../utils'
import { loginAsFoobar } from '../roles'
import { indexWhere } from '../../src/routes/_utils/arrays'
import { homeTimeline } from '../fixtures'

fixture`030-shortcuts-modal.js`
  .page`http://localhost:4002`

test('Backspace dismisses modal', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatusOptionsButton(1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).false
})

test('Backspace dismisses media modal', async t => {
  await loginAsFoobar(t)
  let idx = indexWhere(homeTimeline, _ => (_.content || '').includes('2 kitten photos'))
  await scrollToStatus(t, idx + 1)
  await t
    .click(getNthStatusMediaButton(idx + 1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).false
})

test('Left/right changes active media in modal', async t => {
  await loginAsFoobar(t)
  let idx = indexWhere(homeTimeline, _ => (_.content || '').includes('2 kitten photos'))
  await scrollToStatus(t, idx + 1)
  await t
    .click(getNthStatusMediaButton(idx + 1))
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(getMediaScrollLeft()).eql(0)
  await sleep(1000)
  await t
    .pressKey('right')
    .expect(getMediaScrollLeft()).gt(0)
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).false
})

test('Backspace works correctly for nested modal', async t => {
  await loginAsFoobar(t)
  await scrollToStatus(t, 10)
  await t
    .click(composeButton)
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
    .click(composeModalPostPrivacyButton)
    .expect(visibleModalDialog.textContent).contains('Post privacy')
  await sleep(1000)
  await t
    .pressKey('backspace')
  await t
    .expect(modalDialog.hasAttribute('aria-hidden')).notOk()
    .expect(composeModalInput.exists).ok()
  await sleep(1000)
  await t
    .pressKey('backspace')
    .expect(modalDialog.exists).notOk()
})