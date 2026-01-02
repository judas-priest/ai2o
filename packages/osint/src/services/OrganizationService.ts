/**
 * OrganizationService - Unified company data service
 */

import type { Organization, FSSPCase } from '@ai2o/core';
import { logger } from '@ai2o/core';
import { egrulParser } from '../parsers/egrul';
import { fsspParser } from '../parsers/fssp';
import { torgiParser, Tender } from '../parsers/torgi';

export interface OrganizationReport {
  organization: Organization | null;
  fsspCases: FSSPCase[];
  activeTenders: Tender[];
  riskScore: number;
  riskFactors: string[];
  lastUpdated: string;
}

export class OrganizationService {
  /**
   * Get comprehensive organization report
   */
  async getReport(inn: string): Promise<OrganizationReport> {
    logger.info({ inn }, 'Generating organization report');

    const [egrulResult, fsspResult, tendersResult] = await Promise.all([
      egrulParser.searchByINN(inn),
      fsspParser.searchByINN(inn),
      torgiParser.searchByCustomer(inn)
    ]);

    const organization = egrulResult.organizations[0] || null;
    const fsspCases = fsspResult.cases;
    const activeTenders = tendersResult.tenders.filter(t => t.status !== 'completed');

    // Calculate risk score
    const { riskScore, riskFactors } = this.calculateRisk(organization, fsspCases);

    return {
      organization,
      fsspCases,
      activeTenders,
      riskScore,
      riskFactors,
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateRisk(
    org: Organization | null,
    cases: FSSPCase[]
  ): { riskScore: number; riskFactors: string[] } {
    const factors: string[] = [];
    let score = 0;

    if (!org) {
      factors.push('Company not found in EGRUL');
      score += 50;
    } else if (org.status === 'liquidated') {
      factors.push('Company is liquidated');
      score += 100;
    }

    if (cases.length > 0) {
      factors.push(`${cases.length} FSSP cases found`);
      score += Math.min(cases.length * 10, 50);
    }

    const totalDebt = cases.reduce((sum, c) => sum + (c.amount || 0), 0);
    if (totalDebt > 1000000) {
      factors.push(`High debt: ${totalDebt} RUB`);
      score += 30;
    }

    return {
      riskScore: Math.min(score, 100),
      riskFactors: factors
    };
  }
}

export const organizationService = new OrganizationService();
