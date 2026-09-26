(() => {
  'use strict';

  const project = window.DISCOVERY_PROJECT || {};
  const REVIEW_INDEX_OFFSET = 1;
  const storageKey = `onlinechalo-discovery:${project.projectId || 'unknown'}`;

  const sections = [
    {
      id: 'project-basics',
      title: 'Project basics',
      intro: 'Let us first confirm who the platform is for and the main purpose it should serve.',
      questions: [
        { id: 'respondent_name', type: 'text', required: true, label: 'Your name', placeholder: 'Name of the person completing this discussion' },
        { id: 'business_name', type: 'text', label: 'Business / agency name', placeholder: 'If applicable' },
        {
          id: 'broker_only_platform', type: 'radio', required: true,
          understanding: 'Our understanding: this is a broker-only platform. Landlords and tenants will not have their own logins; brokers will maintain their details for their own work.',
          label: 'Is this understanding correct?',
          options: ['Yes, this is correct', 'No, this needs to be changed', 'Not sure — please recommend']
        },
        {
          id: 'broker_only_change', type: 'textarea', label: 'What should be different?',
          showWhen: { id: 'broker_only_platform', equals: 'No, this needs to be changed' },
          placeholder: 'Please describe who else should be able to use the platform.'
        }
      ]
    },
    {
      id: 'launch-language',
      title: 'Launch area & language',
      intro: 'The first launch location affects RERA verification, localities shown in search and whether local-language support is useful.',
      questions: [
        {
          id: 'launch_city_state', type: 'text', required: true,
          label: 'Which city and state should the first version launch in?',
          placeholder: 'e.g. Bengaluru, Karnataka'
        },
        {
          id: 'launch_area_scope', type: 'radio', required: true,
          label: 'At launch, will the platform cover one city or more than one city?',
          options: ['One city initially', 'Multiple cities from launch', 'Not decided yet — please recommend']
        },
        {
          id: 'local_language_needed', type: 'radio', required: true,
          label: 'Do you want the broker app to support a local language in addition to English?',
          options: ['No, English only is sufficient', 'Yes', 'Not sure — please recommend']
        },
        {
          id: 'local_language_timing', type: 'radio', required: true,
          label: 'When should local-language support be available?',
          options: ['In the first version', 'Can be added in a later phase', 'Not sure — please recommend'],
          showWhen: { id: 'local_language_needed', equals: 'Yes' }
        },
        {
          id: 'local_languages', type: 'text', required: true,
          label: 'Which local language(s) should be supported?',
          help: 'For example: Kannada, Hindi, Marathi, Gujarati.',
          placeholder: 'Enter the language(s)',
          showWhen: { id: 'local_language_needed', equals: 'Yes' }
        },
        {
          id: 'local_language_scope', type: 'radio', required: true,
          label: 'What should be available in the local language?',
          options: ['App menus, buttons and labels', 'App interface plus notifications', 'Also offer translation of shared property / requirement descriptions', 'Not sure — please recommend'],
          showWhen: { id: 'local_language_needed', equals: 'Yes' }
        }
      ]
    },
    {
      id: 'registration-rera',
      title: 'Broker registration & RERA',
      intro: 'The platform is intended to be a trusted broker network, so we need to confirm who can join and how approval should work.',
      questions: [
        {
          id: 'rera_required', type: 'radio', required: true,
          understanding: 'Our understanding: a valid RERA registration is compulsory before a broker can use the platform.',
          label: 'Is RERA registration mandatory for every account?',
          options: ['Yes, mandatory', 'No', 'Not sure — please recommend']
        },
        {
          id: 'account_model', type: 'radio', required: true,
          label: 'If a brokerage/company has one RERA registration, who should be allowed to use the platform under it?',
          options: ['Only one main account', 'The main account plus authorised team members', 'Only people who each have their own individual RERA registration', 'Not sure — please recommend']
        },
        {
          id: 'team_admin', type: 'radio', required: true,
          label: 'If team members are allowed, who should be able to add or remove them?',
          options: ['The main brokerage account', 'Platform administrator only', 'Both', 'Not sure — please recommend'],
          showWhen: { id: 'account_model', equals: 'The main account plus authorised team members' }
        },
        {
          id: 'manual_verification', type: 'radio', required: true,
          label: 'For the first version, is it acceptable for the platform team to review and approve a broker before the account becomes active?',
          help: 'This allows the RERA registration and the applicant’s connection with it to be checked before access is granted.',
          options: ['Yes, manual approval is acceptable initially', 'No, approval should happen automatically from launch', 'Not sure — please recommend']
        },
        {
          id: 'expired_rera', type: 'radio', required: true,
          label: 'If an approved broker’s RERA registration later expires, what should happen until it is renewed?',
          options: ['Allow login but pause new posting and matching', 'Pause the account completely', 'Allow a short grace period', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'broker-profile',
      title: 'Broker profile',
      intro: 'Once a broker is approved, other verified brokers may need to know who they are and how to contact them.',
      questions: [
        {
          id: 'broker_profile_visible', type: 'checkbox', required: true,
          label: 'What should another verified broker be able to see on a broker profile?',
          options: ['Broker name', 'Agency / company name', 'Profile photo / logo', 'RERA registration number', 'Areas served', 'Mobile / WhatsApp number', 'Member since', 'Verified badge']
        },
        {
          id: 'broker_contact_visibility', type: 'radio', required: true,
          label: 'When should a broker’s phone / WhatsApp details become visible to another broker?',
          options: ['Always visible to verified brokers', 'Only after a match/contact request is accepted', 'Let each broker choose', 'Not sure — please recommend']
        },
        {
          id: 'operating_areas', type: 'radio', required: true,
          label: 'Should brokers be able to select the localities or areas they mainly work in?',
          options: ['Yes', 'No', 'Not sure — please recommend']
        },
        {
          id: 'broker_rating', type: 'radio', required: true,
          label: 'Do you want any broker rating / review system?',
          options: ['Yes, in the first version', 'Useful later', 'No', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'property-posting',
      title: 'Posting a rental property',
      intro: 'This section covers what a broker enters when sharing rental inventory and how much of the property is visible to others.',
      questions: [
        {
          id: 'property_fields', type: 'checkbox', required: true,
          label: 'Which property details should normally be captured?',
          options: ['Locality / area', 'Building / society', 'Flat / unit number', 'BHK', 'Area / size', 'Monthly rent', 'Deposit', 'Furnishing', 'Available from', 'Preferred tenant type', 'Pets allowed', 'Parking', 'Photos', 'Brokerage / commission terms']
        },
        {
          id: 'landlord_details_on_property', type: 'radio', required: true,
          label: 'Should the posting broker be able to keep landlord name and contact details with the property?',
          options: ['Yes, and keep them private to the posting broker', 'Yes, with an option to share later if needed', 'No, landlord details are not needed with the property', 'Not sure — please recommend']
        },
        {
          id: 'address_visibility', type: 'radio', required: true,
          label: 'Before a broker-to-broker request is accepted, how much of the property location should another broker see?',
          options: ['Only locality / approximate area', 'Building / society but not flat number', 'Exact address', 'Not sure — please recommend']
        },
        {
          id: 'map_pin_visibility', type: 'radio', required: true,
          label: 'On the shared map, how precise should the property pin be?',
          options: ['Approximate locality', 'Exact building', 'Exact property location', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'property-freshness-search',
      title: 'Keeping property inventory current',
      intro: 'The shared inventory is only useful if other brokers can trust that a property is still available.',
      questions: [
        {
          id: 'expiry_behavior', type: 'radio', required: true,
          label: 'If a property has not been reconfirmed within 48 hours, how should it appear to other brokers?',
          options: ['Stop showing it until the owner confirms it is still available', 'Keep showing it but clearly say availability has not been recently confirmed', 'Not sure — please recommend']
        },
        {
          id: 'withdraw_property', type: 'radio', required: true,
          label: 'Apart from marking a property as rented, should a broker also be able to mark it as withdrawn / no longer available?',
          options: ['Yes', 'No', 'Not sure — please recommend']
        },
        {
          id: 'refresh_rule', type: 'radio', required: true,
          label: 'To keep a property active after 48 hours, should the broker simply confirm that it is still available?',
          options: ['Yes', 'No — another workflow is preferred', 'Not sure — please recommend']
        },
        {
          id: 'refresh_other', type: 'textarea',
          label: 'How would you prefer the availability confirmation to work?',
          placeholder: 'Please describe the preferred workflow.',
          showWhen: { id: 'refresh_rule', equals: 'No — another workflow is preferred' }
        },
        {
          id: 'duplicate_properties', type: 'radio', required: true,
          label: 'If two different brokers are representing the same property, should both be allowed to list it?',
          options: ['Yes, both can list it independently', 'Yes, but show a warning that it may already be listed', 'No, only one listing should be allowed', 'Not sure — please recommend']
        },
        {
          id: 'property_filters', type: 'checkbox', required: true,
          label: 'Which filters are important when a broker searches rental inventory?',
          options: ['Locality / area', 'Budget / rent', 'BHK', 'Furnishing', 'Tenant type', 'Pets', 'Parking', 'Deposit', 'Available from', 'Commission offered']
        },
        {
          id: 'saved_search', type: 'radio', required: true,
          label: 'Should brokers be able to save a search such as “2 BHK in Indiranagar under ₹50,000” for later use?',
          options: ['Yes, in the first version', 'Useful later', 'No', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'customer-requirements',
      title: 'Customer requirements',
      intro: 'A broker can share what their customer is looking for without necessarily revealing the customer’s identity.',
      questions: [
        {
          id: 'lead_fields', type: 'checkbox', required: true,
          label: 'What should a broker capture when posting a customer requirement?',
          options: ['Preferred areas', 'Maximum budget', 'BHK', 'Family / bachelor', 'Profession / job type', 'Pets', 'Furnishing preference', 'Move-in date', 'Commission sharing offered']
        },
        {
          id: 'lead_identity_visibility', type: 'radio', required: true,
          label: 'What should other brokers see about the actual customer?',
          options: ['Requirement details only; keep customer name and contact private', 'Show first name but not contact details', 'Show full customer identity', 'Not sure — please recommend']
        },
        {
          id: 'lead_contact_reveal', type: 'radio', required: true,
          label: 'Should the customer’s phone number ever be shared with another broker through the app?',
          options: ['No, the customer’s broker remains the point of contact', 'Only after both brokers agree to work together', 'Yes, show it with the requirement', 'Not sure — please recommend']
        },
        {
          id: 'lead_active_period', type: 'radio', required: true,
          label: 'How long should a customer requirement normally remain active before the broker is asked to reconfirm it?',
          options: ['2 weeks', '3 weeks', 'Broker should choose the period', 'Another period', 'Not sure — please recommend']
        },
        {
          id: 'lead_active_period_other', type: 'text',
          label: 'What other period would you prefer?',
          placeholder: 'e.g. 30 days',
          showWhen: { id: 'lead_active_period', equals: 'Another period' }
        },
        {
          id: 'lead_close_reason', type: 'radio', required: true,
          label: 'When a broker closes a customer requirement, should the app ask why it was closed?',
          options: ['Yes', 'No, simply closing it is enough', 'Not sure — please recommend']
        },
        {
          id: 'lead_close_reasons', type: 'checkbox', required: true,
          label: 'Which reasons would be useful?',
          options: ['Property found / deal completed', 'Customer stopped searching', 'Customer postponed requirement', 'Other'],
          showWhen: { id: 'lead_close_reason', equals: 'Yes' }
        }
      ]
    },
    {
      id: 'matching-cobroking',
      title: 'Matching & co-broking',
      intro: 'This is the core broker-to-broker workflow: one broker has the customer and another has a suitable property.',
      questions: [
        {
          id: 'match_request_flow', type: 'radio', required: true,
          understanding: 'Suggested flow: Broker A sends an interest/match request → Broker B accepts → contact details are available → the brokers continue by call or WhatsApp.',
          label: 'Is this sufficient for the first version?',
          options: ['Yes, this is sufficient', 'No, more steps are needed', 'Not sure — please recommend']
        },
        {
          id: 'match_request_more', type: 'textarea',
          label: 'What additional step or control is needed?',
          placeholder: 'Please describe it.',
          showWhen: { id: 'match_request_flow', equals: 'No, more steps are needed' }
        },
        {
          id: 'in_app_chat', type: 'radio', required: true,
          label: 'Do brokers need to chat inside the app, or is call / WhatsApp after acceptance enough?',
          options: ['Call / WhatsApp is enough for the first version', 'In-app chat is required from launch', 'In-app chat can be added later', 'Not sure — please recommend']
        },
        {
          id: 'match_steps', type: 'checkbox', required: true,
          label: 'After a match request is sent, which steps would be useful for the brokers to record?',
          options: ['Request sent', 'Accepted', 'Rejected', 'Property viewing planned / completed', 'Deal completed', 'Deal did not proceed']
        },
        {
          id: 'automatic_matching', type: 'radio', required: true,
          label: 'Should the platform automatically point out when a property appears to match an active customer requirement?',
          options: ['Yes, required in the first version', 'Useful, but can be added later', 'No', 'Not sure — please recommend']
        },
        {
          id: 'match_factors', type: 'checkbox', required: true,
          label: 'If matching is included, what should matter most when suggesting a match?',
          options: ['Area / locality', 'BHK', 'Budget / rent', 'Furnishing', 'Family / bachelor preference', 'Pets', 'Move-in / availability date'],
          showWhen: { id: 'automatic_matching', equals: 'Yes, required in the first version' }
        }
      ]
    },
    {
      id: 'deal-completion',
      title: 'When a deal is completed',
      intro: 'We need to confirm what should happen in the app when a customer successfully rents a property.',
      questions: [
        {
          id: 'deal_flow', type: 'radio', required: true,
          understanding: 'Suggested flow: mark the customer requirement as completed → mark the property as rented → create/update the tenant record → keep the completed deal available for later reference.',
          label: 'Does this match the way you expect a successful deal to be recorded?',
          options: ['Yes', 'No, needs changes', 'Not sure — please recommend']
        },
        {
          id: 'deal_flow_change', type: 'textarea',
          label: 'What should be different when a deal is completed?',
          placeholder: 'Please describe the preferred workflow.',
          showWhen: { id: 'deal_flow', equals: 'No, needs changes' }
        },
        {
          id: 'deal_history_visible', type: 'checkbox', required: true,
          label: 'When a broker looks at a completed deal later, what should they be able to see?',
          options: ['Property', 'Customer requirement', 'Brokers involved', 'Deal date', 'Final rent', 'Commission arrangement', 'Notes']
        },
        {
          id: 'commission_tracking', type: 'radio', required: true,
          label: 'Should the app also track whether broker commission has actually been paid?',
          options: ['Yes, in the first version', 'Useful later', 'No, only record the agreed commission', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'landlord-tenant-records',
      title: 'Landlord & tenant records',
      intro: 'Landlords and tenants are not app users. These records are for the broker’s own follow-up and relationship management.',
      questions: [
        {
          id: 'landlord_private', type: 'radio', required: true,
          understanding: 'Our understanding: landlord contact details and private notes belong to the broker who maintains them and are not visible to the wider broker network.',
          label: 'Is this correct?',
          options: ['Yes', 'No, some landlord information should be shared', 'Not sure — please recommend']
        },
        {
          id: 'tenant_private', type: 'radio', required: true,
          understanding: 'Our understanding: converted tenant contact details and private notes also remain with the customer’s broker.',
          label: 'Is this correct?',
          options: ['Yes', 'No, some tenant information should be shared', 'Not sure — please recommend']
        },
        {
          id: 'manual_crm_add', type: 'radio', required: true,
          label: 'Should brokers be able to manually add existing landlords and tenants who did not originate from this platform?',
          options: ['Yes', 'No', 'Useful later', 'Not sure — please recommend']
        },
        {
          id: 'crm_import', type: 'radio', required: true,
          label: 'Do brokers need to import an existing landlord / tenant list from Excel or CSV?',
          options: ['Yes, required at launch', 'Useful later', 'No', 'Not sure — please recommend']
        },
        {
          id: 'crm_export', type: 'radio', required: true,
          label: 'Should brokers be able to download/export their own landlord and tenant records?',
          options: ['Yes, required', 'Useful later', 'No', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'renewals-notifications',
      title: 'Renewals & reminders',
      intro: 'After a tenant moves in, the app can help the broker remember lease renewals and other time-sensitive follow-ups.',
      questions: [
        {
          id: 'lease_duration', type: 'radio', required: true,
          label: 'For a new tenant, how should the lease end date normally be handled?',
          options: ['Suggest 11 months but allow the broker to change it', 'Always use 11 months', 'Broker always enters the start and end date', 'Not sure — please recommend']
        },
        {
          id: 'renewal_window', type: 'radio', required: true,
          label: 'How early should a tenant appear in the renewal watchlist?',
          options: ['30 days before lease end', '45 days before lease end', '60 days before lease end', 'Broker chooses', 'Not sure — please recommend']
        },
        {
          id: 'renewal_actions', type: 'checkbox', required: true,
          label: 'What should the broker be able to do from the renewal watchlist?',
          options: ['Call / copy contact', 'Mark as contacted', 'Add follow-up note', 'Mark renewed', 'Mark vacated']
        },
        {
          id: 'renewal_history', type: 'radio', required: true,
          label: 'After a tenant renews, should the broker be able to look back at previous lease periods?',
          options: ['Yes', 'Only the current lease needs to be shown normally', 'Not sure — please recommend']
        },
        {
          id: 'notification_events', type: 'checkbox', required: true,
          label: 'Which events should alert the broker?',
          options: ['New match request', 'Match accepted / rejected', 'Property needs availability confirmation', 'Customer requirement needs reconfirmation', 'Lease renewal approaching', 'RERA registration nearing expiry', 'Subscription nearing expiry']
        },
        {
          id: 'notification_channels', type: 'checkbox', required: true,
          label: 'How should brokers receive these alerts in the first version?',
          options: ['Inside the app', 'Email', 'WhatsApp']
        },
        {
          id: 'whatsapp_priority', type: 'radio', required: true,
          label: 'If WhatsApp alerts are wanted, are they essential at launch?',
          options: ['Yes, essential at launch', 'Can be added later', 'Not sure — please recommend'],
          showWhen: { id: 'notification_channels', includes: 'WhatsApp' }
        }
      ]
    },
    {
      id: 'subscription-admin',
      title: 'Subscription & platform control',
      intro: 'Your original brief mentions a Free and Paid plan. We only need to clarify how you want those plans and platform controls to work.',
      questions: [
        {
          id: 'free_limit', type: 'radio', required: true,
          label: 'The brief you shared mentions a Free tier with up to 5 property listings and a Paid tier with unlimited listings. How should the 5-property limit work?',
          options: ['Maximum 5 active properties at any one time', 'Maximum 5 new property postings per month', 'Another rule', 'Not sure — please recommend']
        },
        {
          id: 'free_limit_other', type: 'text',
          label: 'What other rule would you prefer for the Free tier?',
          placeholder: 'Describe the intended limit.',
          showWhen: { id: 'free_limit', equals: 'Another rule' }
        },
        {
          id: 'paid_same_features', type: 'radio', required: true,
          label: 'Apart from the property-listing limit, should all other features be the same for Free and Paid brokers initially?',
          options: ['Yes, only the property limit should differ', 'No, some features should also be reserved for Paid brokers', 'Not decided yet — please recommend']
        },
        {
          id: 'paid_features', type: 'textarea', required: true,
          label: 'Which features are you considering for Paid brokers?',
          placeholder: 'Please list any features you want to reserve for Paid accounts.',
          showWhen: { id: 'paid_same_features', equals: 'No, some features should also be reserved for Paid brokers' }
        },
        {
          id: 'payment_launch', type: 'radio', required: true,
          label: 'How should Paid accounts be activated in the first release?',
          options: ['Platform admin can activate them manually during the initial rollout', 'Online subscription payment should be available from launch', 'Start without paid subscriptions and add them later', 'Not sure — please recommend']
        },
        {
          id: 'subscription_cycle', type: 'radio', required: true,
          label: 'What subscription period do you expect eventually?',
          options: ['Monthly', 'Annual', 'Both monthly and annual', 'Not decided yet']
        },
        {
          id: 'admin_controls', type: 'checkbox', required: true,
          label: 'What should the platform owner/admin be able to do?',
          options: ['Approve or reject broker registrations', 'Suspend / reactivate brokers', 'Check RERA verification status', 'View shared properties and customer requirements', 'Remove misleading / fraudulent listings', 'Manage Paid account status', 'Review reports about brokers or listings', 'See basic platform usage']
        },
        {
          id: 'reporting', type: 'radio', required: true,
          label: 'Should brokers be able to report a suspicious broker, fake listing or incorrect property information?',
          options: ['Yes', 'Useful later', 'No', 'Not sure — please recommend']
        }
      ]
    },
    {
      id: 'privacy-prototype-priority',
      title: 'Privacy, prototype & first-version priority',
      intro: 'Finally, let us confirm the overall privacy approach, how closely to follow the prototype and what matters most for the first working version.',
      questions: [
        {
          id: 'privacy_model', type: 'radio', required: true,
          understanding: 'Suggested approach: shared rental inventory and customer requirements are visible to verified brokers; landlord/tenant records remain private; sensitive contact or exact-location details are shared only at the agreed stage of a broker-to-broker match.',
          label: 'Does this broadly match what you want?',
          options: ['Yes', 'No, it needs changes', 'Not sure — please recommend']
        },
        {
          id: 'privacy_change', type: 'textarea',
          label: 'What should be different about information visibility?',
          placeholder: 'Tell us what should always remain private or what should be shared.',
          showWhen: { id: 'privacy_model', equals: 'No, it needs changes' }
        },
        {
          id: 'delivery_surface', type: 'radio', required: true,
          label: 'For the first version, how do you expect brokers to use the product?',
          options: ['Mainly on mobile browser, but it should also work well on desktop', 'Web app plus a separate Android app', 'Web app plus separate Android and iPhone apps', 'Not sure — please recommend']
        },
        {
          id: 'prototype_code', type: 'radio', required: true,
          label: 'Do you have the complete source/project files used to create the current prototype?',
          options: ['Yes, the project/source can be shared', 'No, only the screens/prototype are available', 'Not sure']
        },
        {
          id: 'design_flexibility', type: 'radio', required: true,
          label: 'How closely should the final product follow the current prototype design?',
          options: ['Keep the overall look but improve screens and workflow where needed', 'Follow it very closely', 'Open to a fresh design based on the same concept', 'Not sure — please recommend']
        },
        {
          id: 'first_version_confirmation', type: 'radio', required: true,
          understanding: 'Our current understanding of the first-version journey: verified broker joins → posts/searches rental properties → posts customer requirements → brokers connect on a match → successful deal is recorded → landlord/tenant follow-up and lease renewal can be managed.',
          label: 'Is this the correct core journey for the first working version?',
          options: ['Yes', 'No, something should be added or removed', 'Not sure — please recommend']
        },
        {
          id: 'first_version_change', type: 'textarea',
          label: 'What should be added or removed from the first-version journey?',
          placeholder: 'Please describe the change.',
          showWhen: { id: 'first_version_confirmation', equals: 'No, something should be added or removed' }
        },
        {
          id: 'missing_workflow', type: 'textarea',
          label: 'Is there any important part of a broker’s day-to-day workflow that we have missed?',
          help: 'Optional — add anything that brokers regularly do which is not covered above.',
          placeholder: 'Add any final workflow, rule or concern here.'
        }
      ]
    }
  ];

  const reviewSection = { id: 'review', title: 'Review & submit' };
  const allSteps = [...sections, reviewSection];

  const defaultState = {
    answers: {},
    currentSection: 0,
    maxVisited: 0,
    startedAt: new Date().toISOString(),
    lastSavedAt: null,
    submittedAt: null
  };

  let state = loadState();

  const introPanel = document.getElementById('introPanel');
  const workspace = document.getElementById('workspace');
  const successPanel = document.getElementById('successPanel');
  const sectionContainer = document.getElementById('sectionContainer');
  const stepList = document.getElementById('stepList');
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  const saveStatus = document.getElementById('saveStatus');
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const saveBtn = document.getElementById('saveBtn');
  const startBtn = document.getElementById('startBtn');

  const previewMode = new URLSearchParams(window.location.search).has('preview') || window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);

  startBtn.addEventListener('click', () => {
    introPanel.classList.add('is-hidden');
    workspace.classList.remove('is-hidden');
    render();
  });

  backBtn.addEventListener('click', () => {
    collectVisibleInputs();
    saveLocal();
    if (state.currentSection > 0) {
      state.currentSection -= 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  saveBtn.addEventListener('click', async () => {
    collectVisibleInputs();
    saveLocal();
    await remoteSave('save');
  });

  nextBtn.addEventListener('click', async () => {
    if (state.currentSection < sections.length) {
      collectVisibleInputs();
      if (!validateCurrentSection()) return;
      saveLocal();
      state.currentSection += 1;
      state.maxVisited = Math.max(state.maxVisited, state.currentSection);
      saveLocal(false);
      await remoteSave('save', true);
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    await submitDiscovery();
  });

  if (state.submittedAt) {
    introPanel.classList.add('is-hidden');
    workspace.classList.add('is-hidden');
    successPanel.classList.remove('is-hidden');
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved && saved.answers ? { ...defaultState, ...saved } : { ...defaultState };
    } catch (_) {
      return { ...defaultState };
    }
  }

  function saveLocal(showMessage = true) {
    state.lastSavedAt = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(state));
    if (showMessage) setSaveStatus('saved', 'Progress saved on this device');
  }

  function setSaveStatus(type, message) {
    saveStatus.classList.toggle('is-saving', type === 'saving');
    saveStatus.classList.toggle('is-error', type === 'error');
    saveStatus.querySelector('span:last-child').textContent = message;
  }

  function render() {
    renderSteps();
    renderProgress();
    if (state.currentSection === sections.length) renderReview();
    else renderSection(sections[state.currentSection]);
    backBtn.disabled = state.currentSection === 0;
    nextBtn.textContent = state.currentSection === sections.length ? 'Submit requirements' : 'Save & continue →';
    saveBtn.style.display = state.currentSection === sections.length ? 'none' : '';
  }

  function renderSteps() {
    stepList.innerHTML = allSteps.map((step, index) => {
      const active = index === state.currentSection;
      const complete = index < state.maxVisited;
      const enabled = index <= state.maxVisited;
      const indexLabel = complete ? '✓' : String(index + 1);
      return `<button type="button" class="step ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}" data-step="${index}" ${enabled ? '' : 'disabled'}>
        <span class="step__index">${indexLabel}</span><span class="step__title">${escapeHtml(step.title)}</span>
      </button>`;
    }).join('');

    stepList.querySelectorAll('.step:not([disabled])').forEach(button => {
      button.addEventListener('click', () => {
        collectVisibleInputs();
        saveLocal(false);
        state.currentSection = Number(button.dataset.step);
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function renderProgress() {
    const total = allSteps.length;
    const current = Math.min(state.currentSection + 1, total);
    progressText.textContent = `${current} of ${total}`;
    progressFill.style.width = `${Math.round((current / total) * 100)}%`;
  }

  function renderSection(section) {
    const visibleQuestions = section.questions.filter(isQuestionVisible);
    sectionContainer.innerHTML = `
      <section class="section-card" data-section="${escapeAttr(section.id)}">
        <div class="section-card__head">
          <div class="section-kicker">Section ${state.currentSection + 1}</div>
          <h2>${escapeHtml(section.title)}</h2>
          <p class="section-card__intro">${escapeHtml(section.intro)}</p>
        </div>
        <div class="section-card__body">
          ${visibleQuestions.map((q, idx) => renderQuestion(q, idx + 1)).join('')}
        </div>
      </section>`;

    wireQuestionListeners();
  }

  function renderQuestion(q, displayNumber) {
    const answer = state.answers[q.id];
    const required = q.required ? '<span class="required-mark">*</span>' : '';
    const understanding = q.understanding ? `<div class="confirmation-box">${escapeHtml(q.understanding)}</div>` : '';
    const help = q.help ? `<p class="question__help">${escapeHtml(q.help)}</p>` : '';

    let field = '';
    if (q.type === 'text') {
      field = `<input class="text-input" type="text" id="${escapeAttr(q.id)}" data-question="${escapeAttr(q.id)}" value="${escapeAttr(answer || '')}" placeholder="${escapeAttr(q.placeholder || '')}">`;
    } else if (q.type === 'textarea') {
      field = `<textarea class="textarea" id="${escapeAttr(q.id)}" data-question="${escapeAttr(q.id)}" placeholder="${escapeAttr(q.placeholder || '')}">${escapeHtml(answer || '')}</textarea>`;
    } else if (q.type === 'radio') {
      field = `<div class="option-list">${q.options.map((option, i) => `
        <label class="option"><input type="radio" name="${escapeAttr(q.id)}" value="${escapeAttr(option)}" data-question="${escapeAttr(q.id)}" ${answer === option ? 'checked' : ''}><span>${escapeHtml(option)}</span></label>
      `).join('')}</div>`;
    } else if (q.type === 'checkbox') {
      const selected = Array.isArray(answer) ? answer : [];
      field = `<div class="option-list">${q.options.map(option => `
        <label class="option"><input type="checkbox" name="${escapeAttr(q.id)}" value="${escapeAttr(option)}" data-question="${escapeAttr(q.id)}" ${selected.includes(option) ? 'checked' : ''}><span>${escapeHtml(option)}</span></label>
      `).join('')}</div>`;
    }

    return `<div class="question" data-question-wrap="${escapeAttr(q.id)}">
      <span class="question__number">${String(displayNumber).padStart(2, '0')}</span>
      ${understanding}
      <label class="question__label" for="${escapeAttr(q.id)}">${escapeHtml(q.label)}${required}</label>
      ${help}
      ${field}
      <div class="error-text is-hidden">Please answer this question before continuing.</div>
    </div>`;
  }

  function wireQuestionListeners() {
    sectionContainer.querySelectorAll('[data-question]').forEach(input => {
      const eventName = (input.type === 'text' || input.tagName === 'TEXTAREA') ? 'input' : 'change';
      input.addEventListener(eventName, () => {
        collectVisibleInputs();
        saveLocal(false);
        const q = findQuestion(input.dataset.question);
        if (q && affectsVisibility(q.id)) renderSection(sections[state.currentSection]);
      });
    });
  }

  function collectVisibleInputs() {
    if (state.currentSection >= sections.length) return;
    const section = sections[state.currentSection];
    section.questions.filter(isQuestionVisible).forEach(q => {
      if (q.type === 'checkbox') {
        state.answers[q.id] = [...sectionContainer.querySelectorAll(`input[name="${cssEscape(q.id)}"]:checked`)].map(el => el.value);
      } else if (q.type === 'radio') {
        const checked = sectionContainer.querySelector(`input[name="${cssEscape(q.id)}"]:checked`);
        state.answers[q.id] = checked ? checked.value : '';
      } else {
        const input = sectionContainer.querySelector(`[data-question="${cssEscape(q.id)}"]`);
        state.answers[q.id] = input ? input.value.trim() : (state.answers[q.id] || '');
      }
    });
  }

  function validateCurrentSection() {
    const section = sections[state.currentSection];
    let firstInvalid = null;
    section.questions.filter(isQuestionVisible).forEach(q => {
      const wrap = sectionContainer.querySelector(`[data-question-wrap="${cssEscape(q.id)}"]`);
      if (!wrap) return;
      const answer = state.answers[q.id];
      const invalid = q.required && (Array.isArray(answer) ? answer.length === 0 : !String(answer || '').trim());
      wrap.classList.toggle('has-error', invalid);
      const error = wrap.querySelector('.error-text');
      if (error) error.classList.toggle('is-hidden', !invalid);
      if (invalid && !firstInvalid) firstInvalid = wrap;
    });
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  }

  function renderReview() {
    sectionContainer.innerHTML = `
      <section class="section-card">
        <div class="section-card__head">
          <div class="section-kicker">Final check</div>
          <h2>Review your answers</h2>
          <p class="section-card__intro">Please scan the sections below. You can go back and edit anything before submitting.</p>
        </div>
        <div class="section-card__body">
          <div class="review-grid">
            ${sections.map((section, sectionIndex) => renderReviewBlock(section, sectionIndex)).join('')}
          </div>
        </div>
      </section>`;

    sectionContainer.querySelectorAll('[data-edit-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentSection = Number(btn.dataset.editSection);
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function renderReviewBlock(section, sectionIndex) {
    const questions = section.questions.filter(isQuestionVisible).filter(q => {
      const answer = state.answers[q.id];
      return Array.isArray(answer) ? answer.length : String(answer || '').trim();
    });
    return `<div class="review-block">
      <div class="review-block__head"><strong>${escapeHtml(section.title)}</strong><button type="button" class="review-edit" data-edit-section="${sectionIndex}">Edit</button></div>
      ${questions.length ? questions.map(q => {
        const answer = state.answers[q.id];
        const display = Array.isArray(answer) ? answer.join(', ') : answer;
        return `<div class="review-answer"><div class="review-answer__q">${escapeHtml(q.label)}</div><div class="review-answer__a">${escapeHtml(display)}</div></div>`;
      }).join('') : '<div class="review-answer"><div class="review-answer__a review-empty">No answers recorded in this section.</div></div>'}
    </div>`;
  }

  function isQuestionVisible(q) {
    if (!q.showWhen) return true;
    const answer = state.answers[q.showWhen.id];
    if (Object.prototype.hasOwnProperty.call(q.showWhen, 'equals')) return answer === q.showWhen.equals;
    if (Object.prototype.hasOwnProperty.call(q.showWhen, 'includes')) return Array.isArray(answer) ? answer.includes(q.showWhen.includes) : String(answer || '').includes(q.showWhen.includes);
    if (Array.isArray(q.showWhen.includesAny)) return q.showWhen.includesAny.some(value => Array.isArray(answer) ? answer.includes(value) : String(answer || '').includes(value));
    return true;
  }

  function affectsVisibility(questionId) {
    return sections[state.currentSection].questions.some(q => q.showWhen && q.showWhen.id === questionId);
  }

  function findQuestion(id) {
    for (const section of sections) {
      const q = section.questions.find(item => item.id === id);
      if (q) return q;
    }
    return null;
  }

  function collectResponseRows() {
    const rows = [];
    sections.forEach(section => {
      section.questions.filter(isQuestionVisible).forEach(q => {
        const answer = state.answers[q.id];
        if (Array.isArray(answer) ? answer.length === 0 : !String(answer || '').trim()) return;
        rows.push({
          sectionId: section.id,
          section: section.title,
          questionId: q.id,
          question: q.label,
          answer: Array.isArray(answer) ? answer.join(' | ') : String(answer)
        });
      });
    });
    return rows;
  }

  function buildPayload(action) {
    return {
      action,
      projectId: project.projectId,
      projectToken: project.projectToken,
      projectName: project.projectName,
      template: project.template,
      source: project.source,
      respondentName: state.answers.respondent_name || '',
      businessName: state.answers.business_name || '',
      status: action === 'submit' ? 'Submitted' : 'Draft',
      startedAt: state.startedAt,
      lastSavedAt: new Date().toISOString(),
      submittedAt: action === 'submit' ? new Date().toISOString() : '',
      currentSection: state.currentSection,
      maxVisited: state.maxVisited,
      responses: collectResponseRows()
    };
  }


  async function remoteSave(action, quiet = false) {
    if (!project.endpoint) {
      if (!quiet) setSaveStatus('saved', 'Draft saved on this device');
      return true;
    }
    try {
      setSaveStatus('saving', action === 'submit' ? 'Submitting…' : 'Saving…');
      const body = new URLSearchParams();
      body.set('payload', JSON.stringify(buildPayload(action)));
      await fetch(project.endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body });
      setSaveStatus('saved', action === 'submit' ? 'Submitted' : 'Saved');
      return true;
    } catch (error) {
      console.error(error);
      setSaveStatus('error', 'Could not reach the submission service. Your answers are still saved on this device.');
      return false;
    }
  }

  async function submitDiscovery() {
    if (!project.endpoint && !previewMode) {
      setSaveStatus('error', 'Submission is not yet enabled for this project. Please contact OnlineChalo.');
      return;
    }
    nextBtn.disabled = true;
    nextBtn.textContent = 'Submitting…';
    const ok = project.endpoint ? await remoteSave('submit') : true;
    nextBtn.disabled = false;
    nextBtn.textContent = 'Submit requirements';
    if (!ok) return;
    state.submittedAt = new Date().toISOString();
    saveLocal(false);
    workspace.classList.add('is-hidden');
    successPanel.classList.remove('is-hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }
  function escapeAttr(value) { return escapeHtml(value); }
  function cssEscape(value) { return window.CSS && CSS.escape ? CSS.escape(String(value)) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&'); }
})();
