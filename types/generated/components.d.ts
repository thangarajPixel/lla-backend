import type { Schema, Struct } from '@strapi/strapi';

export interface AboutAbout extends Struct.ComponentSchema {
  collectionName: 'components_about_abouts';
  info: {
    displayName: 'about';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface AboutFounder extends Struct.ComponentSchema {
  collectionName: 'components_about_founders';
  info: {
    displayName: 'founder';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface AboutLegacy extends Struct.ComponentSchema {
  collectionName: 'components_about_legacies';
  info: {
    displayName: 'legacy';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface AboutTeam extends Struct.ComponentSchema {
  collectionName: 'components_about_teams';
  info: {
    displayName: 'team';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface AddressAddress extends Struct.ComponentSchema {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'address';
  };
  attributes: {
    blood_grp: Schema.Attribute.String;
    city: Schema.Attribute.String;
    flat: Schema.Attribute.Text;
    hobies: Schema.Attribute.String;
    photography_club: Schema.Attribute.String;
    pincode: Schema.Attribute.String;
  };
}

export interface CampusFacilitiesGallery extends Struct.ComponentSchema {
  collectionName: 'components_campus_facilities_galleries';
  info: {
    displayName: 'facilities_gallery';
  };
  attributes: {};
}

export interface CampusInfraFacilities extends Struct.ComponentSchema {
  collectionName: 'components_campus_infra_facilities';
  info: {
    displayName: 'infra_facilities';
  };
  attributes: {
    banner: Schema.Attribute.Component<'course.banner', false>;
    campus_video: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    facilities_gallery: Schema.Attribute.Component<
      'campus.facilities-gallery',
      false
    >;
    location: Schema.Attribute.Component<'campus.location', false>;
    overview: Schema.Attribute.Component<'campus.overview', false>;
    testimonial: Schema.Attribute.Component<'campus.testimonial', false>;
  };
}

export interface CampusLocation extends Struct.ComponentSchema {
  collectionName: 'components_campus_locations';
  info: {
    displayName: 'location';
  };
  attributes: {};
}

export interface CampusOverview extends Struct.ComponentSchema {
  collectionName: 'components_campus_overviews';
  info: {
    displayName: 'overview';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CampusTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_campus_testimonials';
  info: {
    displayName: 'testimonial';
  };
  attributes: {};
}

export interface CourseBanner extends Struct.ComponentSchema {
  collectionName: 'components_course_banners';
  info: {
    displayName: 'banner';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseBenefit extends Struct.ComponentSchema {
  collectionName: 'components_course_benefits';
  info: {
    displayName: 'benefit';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseCourseModule extends Struct.ComponentSchema {
  collectionName: 'components_course_course_modules';
  info: {
    displayName: 'course_module';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseCourseOverView extends Struct.ComponentSchema {
  collectionName: 'components_course_course_over_views';
  info: {
    displayName: 'course_over_view';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseDipProfessional extends Struct.ComponentSchema {
  collectionName: 'components_course_dip_professionals';
  info: {
    displayName: 'course';
  };
  attributes: {
    banner: Schema.Attribute.Component<'course.banner', false>;
    benefit: Schema.Attribute.Component<'course.benefit', false>;
    course_module: Schema.Attribute.Component<'course.course-module', false>;
    course_over_view: Schema.Attribute.Component<
      'course.course-over-view',
      false
    >;
    faq: Schema.Attribute.Component<'course.faq', false>;
    student_review: Schema.Attribute.Component<'course.student-review', false>;
    testimonial: Schema.Attribute.Component<'course.testimonial', false>;
  };
}

export interface CourseFaq extends Struct.ComponentSchema {
  collectionName: 'components_course_faqs';
  info: {
    displayName: 'faq';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseStudentReview extends Struct.ComponentSchema {
  collectionName: 'components_course_student_reviews';
  info: {
    displayName: 'student_review';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_course_testimonials';
  info: {
    displayName: 'testimonial';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface FaqBanner extends Struct.ComponentSchema {
  collectionName: 'components_faq_banners';
  info: {
    displayName: 'banner';
  };
  attributes: {
    img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface HomeAbout extends Struct.ComponentSchema {
  collectionName: 'components_home_abouts';
  info: {
    displayName: 'about';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeBanner extends Struct.ComponentSchema {
  collectionName: 'components_home_banners';
  info: {
    displayName: 'banner';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface HomeCampus extends Struct.ComponentSchema {
  collectionName: 'components_home_campuses';
  info: {
    displayName: 'campus';
  };
  attributes: {
    Bg_img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeCard extends Struct.ComponentSchema {
  collectionName: 'components_home_cards';
  info: {
    displayName: 'card';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeCourse extends Struct.ComponentSchema {
  collectionName: 'components_home_courses';
  info: {
    displayName: 'course';
  };
  attributes: {
    card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface HomeFaculty extends Struct.ComponentSchema {
  collectionName: 'components_home_faculties';
  info: {
    displayName: 'faculty';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeGallery extends Struct.ComponentSchema {
  collectionName: 'components_home_galleries';
  info: {
    displayName: 'gallery';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Heading: Schema.Attribute.String;
    Img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeLife extends Struct.ComponentSchema {
  collectionName: 'components_home_lives';
  info: {
    displayName: 'life';
  };
  attributes: {
    Bg_img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Btn_txt: Schema.Attribute.String;
    card: Schema.Attribute.Component<'home.card', true>;
    Heading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface HomeLlaTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_home_lla_testimonials';
  info: {
    displayName: 'lla_testimonials';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    slider: Schema.Attribute.Component<'home.slider', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeSlider extends Struct.ComponentSchema {
  collectionName: 'components_home_sliders';
  info: {
    displayName: 'slider';
  };
  attributes: {
    Batch: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Name: Schema.Attribute.String;
  };
}

export interface HomeSponsor extends Struct.ComponentSchema {
  collectionName: 'components_home_sponsors';
  info: {
    displayName: 'sponsor';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_home_testimonials';
  info: {
    displayName: 'testimonial';
  };
  attributes: {
    card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface LanguageLanguageAndProficiency extends Struct.ComponentSchema {
  collectionName: 'components_language_language_and_proficiencies';
  info: {
    displayName: 'Language & Proficiency';
  };
  attributes: {
    language: Schema.Attribute.String;
    read: Schema.Attribute.Boolean;
    speak: Schema.Attribute.Boolean;
    write: Schema.Attribute.Boolean;
  };
}

export interface ParentGuardianSpouseDetailsParentGuardianSpouseDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_parent_guardian_spouse_details_parent_guardian_spouse_details';
  info: {
    displayName: ' Parent/Guardian/Spouse Details';
  };
  attributes: {
    contact_no: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    name: Schema.Attribute.String;
    profession: Schema.Attribute.String;
  };
}

export interface PostGraduatePostGraduate extends Struct.ComponentSchema {
  collectionName: 'components_post_graduate_post_graduates';
  info: {
    displayName: 'Post_Graduate';
  };
  attributes: {
    Finished: Schema.Attribute.Boolean;
    Graduation_Degree: Schema.Attribute.String;
  };
}

export interface SeoHome extends Struct.ComponentSchema {
  collectionName: 'components_seo_homes';
  info: {
    displayName: 'home';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface UnderGraduateUnderGraduate extends Struct.ComponentSchema {
  collectionName: 'components_under_graduate_under_graduates';
  info: {
    displayName: 'Under_Graduate';
  };
  attributes: {
    Finshed: Schema.Attribute.Boolean & Schema.Attribute.Required;
    Gaduation_Degree: Schema.Attribute.String & Schema.Attribute.Required;
    Upload_Marksheet: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface WorkExperienceWorkExperience extends Struct.ComponentSchema {
  collectionName: 'components_work_experience_work_experiences';
  info: {
    displayName: 'Work Experience';
  };
  attributes: {
    Duration: Schema.Attribute.Date & Schema.Attribute.Required;
    Employeer: Schema.Attribute.String;
    Reference: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Role_Designation: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.about': AboutAbout;
      'about.founder': AboutFounder;
      'about.legacy': AboutLegacy;
      'about.team': AboutTeam;
      'address.address': AddressAddress;
      'campus.facilities-gallery': CampusFacilitiesGallery;
      'campus.infra-facilities': CampusInfraFacilities;
      'campus.location': CampusLocation;
      'campus.overview': CampusOverview;
      'campus.testimonial': CampusTestimonial;
      'course.banner': CourseBanner;
      'course.benefit': CourseBenefit;
      'course.course-module': CourseCourseModule;
      'course.course-over-view': CourseCourseOverView;
      'course.dip-professional': CourseDipProfessional;
      'course.faq': CourseFaq;
      'course.student-review': CourseStudentReview;
      'course.testimonial': CourseTestimonial;
      'faq.banner': FaqBanner;
      'home.about': HomeAbout;
      'home.banner': HomeBanner;
      'home.campus': HomeCampus;
      'home.card': HomeCard;
      'home.course': HomeCourse;
      'home.faculty': HomeFaculty;
      'home.gallery': HomeGallery;
      'home.life': HomeLife;
      'home.lla-testimonials': HomeLlaTestimonials;
      'home.slider': HomeSlider;
      'home.sponsor': HomeSponsor;
      'home.testimonial': HomeTestimonial;
      'language.language-and-proficiency': LanguageLanguageAndProficiency;
      'parent-guardian-spouse-details.parent-guardian-spouse-details': ParentGuardianSpouseDetailsParentGuardianSpouseDetails;
      'post-graduate.post-graduate': PostGraduatePostGraduate;
      'seo.home': SeoHome;
      'under-graduate.under-graduate': UnderGraduateUnderGraduate;
      'work-experience.work-experience': WorkExperienceWorkExperience;
    }
  }
}
