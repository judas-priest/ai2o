/**
 * @ai2o/osint - OSINT tools
 *
 * Parsers for Russian open data sources:
 * - EGRUL (company registry)
 * - FSSP (court cases)
 * - Torgi (tenders)
 */

export * from './parsers/egrul';
export * from './parsers/fssp';
export * from './parsers/torgi';
export * from './services/OrganizationService';

export const VERSION = '1.0.0';
