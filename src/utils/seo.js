// SEO utilities
export const seo = {
  // Update page title and meta description
  updatePageMeta(title, description, keywords = []) {
    // Update title
    document.title = title ? `${title} | DevChain` : 'DevChain - Learning Milestone Tracker'
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = description || 'Track your learning journey on the blockchain with verifiable NFT badges'
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.content = keywords.length > 0 ? keywords.join(', ') : 'blockchain, learning, education, NFT, badges, Hedera'
  },

  // Generate structured data for rich snippets
  generateStructuredData(type, data) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    }
    
    let script = document.querySelector('#structured-data')
    if (!script) {
      script = document.createElement('script')
      script.id = 'structured-data'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)
  },

  // Update Open Graph tags for social sharing
  updateOpenGraph(title, description, image, url) {
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'DevChain' }
    ]
    
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.content = content
    })
  }
}