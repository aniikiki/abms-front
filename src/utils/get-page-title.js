import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Address Book Manager System';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
