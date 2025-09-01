class PushSubscriptionKeys {
  p256dh: string
  auth: string
}

export class CreatePushSubscriptionDto {
  endpoint: string
  keys: PushSubscriptionKeys
  userAgent?: string
}
