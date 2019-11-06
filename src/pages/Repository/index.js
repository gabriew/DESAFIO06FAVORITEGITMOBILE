import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Browser} from './styles';

export default class Repository extends Component {
    render() {
        const {navigation} = this.props;
        const repository = navigation.getParam('repository');
        return (
            <Browser
                onLoadEnd={this.handleLoad}
                source={{uri: repository.html_url}}
            />
        );
    }
}

Repository.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
    }).isRequired,
};

Repository.navigationOptions = ({navigation}) => ({
    title: navigation.getParam('repository').name,
});
