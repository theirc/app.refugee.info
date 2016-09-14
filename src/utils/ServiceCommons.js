import React from 'react';
import {Icon} from '../components';
import styles, {themes} from '../styles';

export default class ServiceCommons {

    renderStars(rating) {
        return ([...new Array(5)].map((x, i) => (
            <Icon
                key={i}
                name={(rating >= i + 1) ? 'fa-star' : 'fa-star-o'}
                style={[
                    styles.ratingIcon,
                    (rating >= i + 1) ? null: {color: themes.light.dividerColor}
                ]}
            />
          )));
    }
}
