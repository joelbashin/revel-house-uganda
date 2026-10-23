import { getOrgSettings, getPrograms, getProjects, getArticles, getImpactStats } from './api';
import { Program, Project, Article, ImpactStat, OrganizationSettings } from '../types';

export interface KnowledgeContext {
  organization: string;
  programs: string;
  projects: string;
  articles: string;
  stats: string;
  formattedContext: string;
}

/**
 * Builds a clean, compact RAG context from public CMS data.
 * Does NOT expose private admin collections, keys, or user data.
 */
export async function buildPublicKnowledgeContext(userQuery: string = ''): Promise<string> {
  try {
    const [settings, programs, projects, articles, stats] = await Promise.all([
      getOrgSettings(),
      getPrograms(),
      getProjects(),
      getArticles(),
      getImpactStats(),
    ]);

    const queryLower = userQuery.toLowerCase();

    // 1. Organization overview
    const orgSummary = formatOrgSettings(settings);

    // 2. Filter / prioritize relevant programs
    const relevantPrograms = filterRelevant(programs, queryLower, (p) => `${p.title} ${p.category} ${p.shortDescription} ${p.description}`);
    const programSummary = relevantPrograms.map((p) => `- **${p.title}** (${p.category}): ${p.shortDescription}. Objectives: ${p.objectives.join('; ')}`).join('\n');

    // 3. Filter / prioritize relevant projects
    const relevantProjects = filterRelevant(projects, queryLower, (p) => `${p.title} ${p.summary} ${p.problem} ${p.location}`);
    const projectSummary = relevantProjects.map((p) => `- **${p.title}** (Status: ${p.status}, Location: ${p.location}): ${p.summary}. Raising: $${p.amountRaised || 0}/$${p.fundingGoal || 0} ${p.currency || 'USD'}. Progress: ${p.progressPercentage}%`).join('\n');

    // 4. Filter / prioritize relevant articles
    const relevantArticles = filterRelevant(articles, queryLower, (a) => `${a.title} ${a.category} ${a.excerpt}`);
    const articleSummary = relevantArticles.slice(0, 3).map((a) => `- **${a.title}** (${a.category}, ${a.publishedDate}): ${a.excerpt}`).join('\n');

    // 5. Impact statistics
    const statsSummary = stats.map((s) => `- ${s.label}: ${s.value}${s.suffix} (${s.description})`).join('\n');

    const formattedContext = `
=== REVEL HOUSE UGANDA OFFICIAL PUBLIC KNOWLEDGE ===

-- ORGANIZATION DETAILS --
${orgSummary}

-- IMPACT STATISTICS --
${statsSummary}

-- KEY PROGRAMS --
${programSummary || 'No matching program data.'}

-- ACTIVE & PLANNED PROJECTS --
${projectSummary || 'No matching project data.'}

-- RECENT NEWS & ARTICLES --
${articleSummary || 'No matching news articles.'}

====================================================
`.trim();

    return formattedContext;
  } catch (err) {
    console.error('Error building AI knowledge context:', err);
    return 'Revel House Uganda is a community-led NGO in Uganda focusing on child welfare, education, health, WASH, and caregiver livelihoods.';
  }
}

function formatOrgSettings(s: OrganizationSettings): string {
  return `
Name: ${s.name}
Tagline: ${s.tagline}
Mission: ${s.mission}
Vision: ${s.vision}
Country: ${s.country} (Founded: ${s.foundedYear})
Registration: ${s.registrationNumber}
Contact Email: ${s.contactEmail}
Contact Phone: ${s.contactPhone}
Address: ${s.address}
Bank Details (for Direct Bank Transfer): Bank: ${s.bankDetails?.bankName || 'Revel House Uganda'}, Account Name: ${s.bankDetails?.accountName || 'Revel House Uganda'}, Account Number: ${s.bankDetails?.accountNumber || 'Pending'}, SWIFT Code: ${s.bankDetails?.swiftCode || 'Pending'}
Social Media: Facebook (${s.socialLinks.facebook || 'N/A'}), Instagram (${s.socialLinks.instagram || 'N/A'}), YouTube (${s.socialLinks.youtube || 'N/A'})
`.trim();
}

function filterRelevant<T>(items: T[], query: string, getText: (item: T) => string): T[] {
  if (!query || query.trim().length === 0) {
    return items;
  }

  const queryWords = query.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) return items;

  // Score items by keyword matches
  const scored = items.map((item) => {
    const text = getText(item).toLowerCase();
    let score = 0;
    queryWords.forEach((word) => {
      if (text.includes(word)) score += 1;
    });
    return { item, score };
  });

  // Sort by score desc
  scored.sort((a, b) => b.score - a.score);

  // If top matches have score > 0, return items with score > 0, else return all
  const matches = scored.filter((s) => s.score > 0).map((s) => s.item);
  return matches.length > 0 ? matches : items;
}
