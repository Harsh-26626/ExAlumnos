const jobPostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: { type: String, required: true },
    jobDescription: { type: String, required: true },
    qualifications: { type: String, required: true },
    skills: { type: String, required: true },
    eligibilityCriteria: { type: String, required: true },
    salaryRange: { type: String, required: true },
    aboutCompany: { type: String, required: true },
    benefits: { type: String, required: true },
    websiteLink: { type: String, required: true },
  }, { timestamps: true });
  
  const JobPost = mongoose.model('JobPost', jobPostSchema);