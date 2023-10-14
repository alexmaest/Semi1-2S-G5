const filterModel = require('../models/filterModel');

class FilterController {
    constructor() {}

    async getAllFilters(req, res) {
        try {
            const filter = new filterModel(null, null, null);
            const filters = await filter.getAllFilters();
            if (!filters) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Succesful request', data: filters });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getFriendsPostsFilter(req, res) {
        try {
            const data = req.params;
            const filter = new filterModel(data.id_filter, data.id_user, null);
            const posts = await filter.getFriendsPostsFilter();
            if (!posts) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Succesful request', data: posts });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getFiltersByNames(req, res) {
        try {
            const filterName = req.params.name;
            const filter = new filterModel(null, null, filterName);
            const filters = await filter.getFiltersByNames();
            if (!filters) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Succesful request', data: filters });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new FilterController();
