import { FeatureSet } from "./featureset.model";
import { Feature } from "./feature.model";

/**
 * Model for FeatureSet with associated Features.
 */
export class FeatureSetWithFeaturesDTO {

    /**
     * The FeatureSet entity.
     */
    featureSet: FeatureSet;

    /**
     * The list of Features associated with the FeatureSet.
     */
    features: Feature[];

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.featureSet = new FeatureSet(data.featureSet);
        this.features = data.features.map((feature: any) => new Feature(feature));
    }
}
