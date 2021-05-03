import { toast } from 'react-toastify'
import { createDomain } from 'effector'

type PopUpNotification = { text: string }

const notificationsDomain = createDomain()

const notifySuccess = notificationsDomain.createEvent<PopUpNotification>()
const notifyError = notificationsDomain.createEvent<PopUpNotification>()
const notifyNativeError = notificationsDomain.createEvent<Error>()
const notifyInfo = notificationsDomain.createEvent<PopUpNotification>()
const notifyWarning = notificationsDomain.createEvent<PopUpNotification>()

notifySuccess.watch((notification) => toast(notification.text, { type: 'success' }))
notifyError.watch((notification) => toast(notification.text, { type: 'error' }))
notifyNativeError.watch((e) => toast(e.message, { type: 'error' }))
notifyInfo.watch((notification) => toast(notification.text, { type: 'info' }))
notifyWarning.watch((notification) => toast(notification.text, { type: 'warning' }))

export const toastsModel = {
    notifySuccess,
    notifyError,
    notifyNativeError,
    notifyInfo,
    notifyWarning,
}
