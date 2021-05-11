import defaultSettings from '@/settings'

const title = defaultSettings.title || 'The Address Book Manager System'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
