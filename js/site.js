/* Evogr Solutions: site behaviour (nav, testimonials, form submission). */
(function () {
  'use strict';

  // ---- Mobile nav + dropdowns ----
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('.dd > button').forEach(function (b) {
    b.addEventListener('click', function () { b.parentElement.classList.toggle('open'); });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.dd.open').forEach(function (d) { if (!d.contains(e.target)) d.classList.remove('open'); });
  });

  // ---- Testimonials ----
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = [].slice.call(root.querySelectorAll('.q-slide'));
    var count = root.querySelector('.q-count');
    var i = 0, timer;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.hidden = k !== i; });
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 12000); }
    root.querySelectorAll('[data-q]').forEach(function (b) {
      b.addEventListener('click', function () { show(i + (b.getAttribute('data-q') === 'next' ? 1 : -1)); restart(); });
    });
    show(0); restart();
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
  });

  // ---- Forms ----
  var SUPABASE_URL = 'https://sohvtfdujdakmbxppfqg.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaHZ0ZmR1amRha21ieHBwZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTc5NzAsImV4cCI6MjA0ODI5Mzk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // public anon key (row-level security applies)
  var W3F_KEY = '85a73c7c-6ac9-4374-b9c9-d42bf807b09c'; // public Web3Forms key

  function supabaseInsert(table, row) {
    return fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row)
    }).then(function (r) { if (!r.ok) throw new Error('save failed ' + r.status); });
  }

  function web3forms(subject, fields) {
    var payload = { access_key: W3F_KEY, subject: subject, from_name: 'Evogr Website', page: location.href };
    Object.keys(fields).forEach(function (k) { payload[k] = fields[k]; });
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), keepalive: true
    });
  }

  function val(form, name) { var el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }
  function checked(form, name) { var el = form.elements[name]; return !!(el && el.checked); }
  function multi(form, name) {
    return [].slice.call(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (c) { return c.value; });
  }
  function orNull(s) { return s === '' ? null : s; }

  var handlers = {
    subscribe: {
      ok: 'Thanks, you are subscribed.',
      run: function (f) { return supabaseInsert('email_subscribers', { email: val(f, 'email') }); }
    },
    contact: {
      ok: 'Thank you. Your message has been sent. We usually reply within 24 hours.',
      run: function (f) {
        var message = val(f, 'message');
        var extra = [val(f, 'subject') && 'Subject: ' + val(f, 'subject'), val(f, 'priority') && 'Priority: ' + val(f, 'priority'), val(f, 'company') && 'Company: ' + val(f, 'company')].filter(Boolean);
        if (extra.length) message = extra.join(' | ') + '\n\n' + message;
        var row = { name: val(f, 'name'), email: val(f, 'email'), phone: val(f, 'phone'), message: message };
        var mail = web3forms('New website submission: Contact', { Name: row.name, Email: row.email, Phone: row.phone, Company: val(f, 'company'), Subject: val(f, 'subject'), Priority: val(f, 'priority'), Message: val(f, 'message') }).catch(function () {});
        return Promise.all([supabaseInsert('contact_submissions', row), mail]);
      }
    },
    hire: {
      ok: 'Thank you. Our team will contact you within 24 hours with a tailored proposal.',
      run: function (f) {
        return supabaseInsert('hire_talent_submissions', {
          name: val(f, 'name'), email: val(f, 'email'), phone: val(f, 'phone'), company: val(f, 'company'),
          industry: val(f, 'industry'), service_type: val(f, 'serviceType'), location: val(f, 'location'),
          team_size: val(f, 'teamSize'), timeline: val(f, 'timeline'), budget: val(f, 'budget'),
          description: val(f, 'description'), gender: val(f, 'gender')
        });
      }
    },
    join: {
      ok: 'Thank you. Your application has been received. We will contact you within 48 hours.',
      run: function (f) {
        return supabaseInsert('join_workforce_submissions', {
          first_name: val(f, 'firstName'), last_name: val(f, 'lastName'), email: val(f, 'email'), phone: val(f, 'phone'),
          date_of_birth: orNull(val(f, 'dateOfBirth')), gender: val(f, 'gender'), address: val(f, 'address'),
          city: val(f, 'city'), state: val(f, 'state'), pincode: val(f, 'pincode'), education: val(f, 'education'),
          experience: val(f, 'experience'), current_employment: val(f, 'currentEmployment'), skills: val(f, 'skills'),
          languages: val(f, 'languages'), service_types: multi(f, 'serviceTypes'), preferred_locations: val(f, 'preferredLocations'),
          availability: val(f, 'availability'), salary_expectation: val(f, 'salaryExpectation'),
          is_veteran: checked(f, 'isVeteran'), military_service: val(f, 'militaryService'),
          additional_info: val(f, 'additionalInfo'), has_transport: checked(f, 'hasTransport'),
          willing_to_travel: checked(f, 'willingToTravel')
        });
      }
    }
  };

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var key = form.getAttribute('data-form');
    var h = handlers[key];
    if (!h) return;
    var status = document.querySelector('[data-status-for="' + key + '"]');
    function say(cls, msg) { if (status) { status.className = 'form-status ' + cls; status.textContent = msg; } }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (val(form, 'website')) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var submit = form.querySelector('[type="submit"]');
      var label = submit && submit.textContent;
      if (submit) { submit.disabled = true; submit.textContent = 'Sending...'; }
      Promise.resolve().then(function () { return h.run(form); }).then(function () {
        say('ok', h.ok); form.reset();
      }).catch(function () {
        say('err', 'Sorry, something went wrong. Please try again or email info@evogr.net.');
      }).then(function () {
        if (submit) { submit.disabled = false; submit.textContent = label; }
      });
    });
  });
})();
