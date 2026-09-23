/**
 * Model for QualityCriterion class: a single rule within a QualityCriteria set.
 */
export class QualityCriterion {
    /**
     * The ID of the QualityCriterion
     */
    qualityCriterionId: string;

    /**
     * The ID of the criteria set it belongs to
     */
    qualityCriteriaId: string;

    /**
     * The Feature the rule applies to, when it targets one
     */
    featureId: string;

    /**
     * The name of the rule
     */
    name: string;

    /**
     * The description of the rule
     */
    description: string;

    /**
     * Kahn framework category: completeness, conformance or plausibility
     */
    category: string;

    /**
     * Kahn framework context: verification or validation
     */
    context: string;

    /**
     * The optional subcategory
     */
    subcategory: string;

    /**
     * The expression language
     */
    language: string;

    /**
     * The query computing the aliased measures the rule is built on
     */
    expression: string;

    /**
     * The formula over those aliases, checked against the bounds
     */
    ruleExpression: string;

    /**
     * The lower bound, when the rule has one
     */
    low: number;

    /**
     * The upper bound, when the rule has one
     */
    high: number;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.qualityCriterionId = data.qualityCriterionId;
        this.qualityCriteriaId = data.qualityCriteriaId;
        this.featureId = data.featureId;
        this.name = data.name;
        this.description = data.description;
        this.category = data.category;
        this.context = data.context;
        this.subcategory = data.subcategory;
        this.language = data.language;
        this.expression = data.expression;
        this.ruleExpression = data.ruleExpression;
        this.low = data.low;
        this.high = data.high;
    }
}
