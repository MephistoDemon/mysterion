const ShowNotification = function (title, body, ttl = 3) {
  let notification = new Notification(title, {body: body})
  setTimeout(notification.close.bind(notification), ttl * 1000)
  return notification
}

export default ShowNotification
