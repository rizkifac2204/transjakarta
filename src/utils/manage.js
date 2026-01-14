export function canManage(target, current) {
  return target > current;
}

export function isMe(target, current) {
  return target === current;
}
