let EmailService = require('../../ServiceLayer/Services/EmailService.js');

EmailService.getInstance().sendTextEmail(
    'tamer.nassar@intel.com',
    'Test mail service',
    'this is a test mail service \n' +
            'new line working ? '
);

