import { Link } from 'react-router-dom';
import BlogPost from '../../components/layout/BlogPost';

export default function BankruptcyMeansTest() {
  return (
    <BlogPost
      title="The Bankruptcy Means Test in Louisiana Explained | Diment & Associates"
      metaDescription="The bankruptcy means test determines whether you qualify for Chapter 7 in Louisiana. Learn how it works, what the Louisiana median income thresholds are, and what happens if you don't pass."
      canonicalPath="/blog/bankruptcy-means-test"
      headline="The Bankruptcy Means Test in Louisiana Explained"
      intro="Before you can file Chapter 7 bankruptcy, you must pass the means test. Many people hear 'means test' and assume they will not qualify. In practice, the majority of filers pass — and those who don't have a clear alternative path in Chapter 13."
    >
      <h2>What Is the Means Test?</h2>
      <p>
        The bankruptcy means test is a calculation introduced by Congress in 2005 to ensure that people who can genuinely afford to repay a meaningful portion of their debts do so through a Chapter 13 repayment plan, rather than discharging everything through Chapter 7.
      </p>
      <p>
        The test has two steps. The first step compares your income to the Louisiana median income for your household size. Many filers clear the test at this first step and never need to proceed further. The second step is a more detailed calculation for those whose income is above the median.
      </p>

      <h2>Step 1: Compare Your Income to the Louisiana Median</h2>
      <p>
        The means test uses your <strong>average monthly income over the 6 calendar months before filing</strong>, multiplied by 12 to get an annual figure. This is called your "Current Monthly Income" (CMI).
      </p>
      <p>
        If your CMI is at or below the Louisiana median income for your household size, <strong>you automatically pass the means test</strong> and can file Chapter 7 without any further calculation.
      </p>
      <p>
        Louisiana median income figures are published and updated periodically by the U.S. Trustee Program. As a general reference (figures change — your attorney will use current numbers):
      </p>
      <table className="bp-table">
        <thead>
          <tr><th>Household Size</th><th>Approximate Louisiana Annual Median</th></tr>
        </thead>
        <tbody>
          <tr><td>1 person</td><td>~$50,000–$54,000</td></tr>
          <tr><td>2 people</td><td>~$65,000–$70,000</td></tr>
          <tr><td>3 people</td><td>~$75,000–$80,000</td></tr>
          <tr><td>4 people</td><td>~$90,000–$95,000</td></tr>
          <tr><td>5+ people</td><td>Add ~$9,000 per additional person</td></tr>
        </tbody>
      </table>

      <div className="bp-warning">
        <p><strong>Note:</strong> These figures are approximate and updated regularly by the U.S. Trustee's office. Do not make decisions based on these numbers alone — your attorney will pull the current official figures at your consultation.</p>
      </div>

      <h2>What Counts as "Income" for the Means Test?</h2>
      <p>
        Income for the means test is broader than just your paycheck. It typically includes:
      </p>
      <ul>
        <li>Wages, salary, and self-employment income</li>
        <li>Rental income</li>
        <li>Interest, dividends, and royalties</li>
        <li>Regular contributions from household members</li>
        <li>Net monthly income from business operations</li>
        <li>Pension and retirement income</li>
      </ul>
      <p>It generally does <em>not</em> include:</p>
      <ul>
        <li>Social Security benefits (both retirement and disability)</li>
        <li>Payments to victims of war crimes or terrorism</li>
        <li>Certain payments to victims of domestic violence</li>
      </ul>
      <p>
        The exclusion of Social Security income is significant. Many retirees or disabled individuals who receive primarily Social Security may automatically qualify for Chapter 7 simply because their Social Security income is excluded from the CMI calculation.
      </p>

      <h2>Step 2: If You Are Above the Median</h2>
      <p>
        If your income exceeds the Louisiana median for your household size, you proceed to the second part of the means test — the "disposable income" calculation. This is where the test gets more complex, but also more forgiving than most people expect.
      </p>
      <p>
        The second part subtracts a series of <strong>allowed expenses</strong> from your income:
      </p>
      <ul>
        <li><strong>IRS National Standards:</strong> Standardized allowances for food, clothing, personal care, and out-of-pocket health care based on your household size</li>
        <li><strong>IRS Local Standards:</strong> Allowances for housing, utilities, and transportation based on your county of residence</li>
        <li><strong>Actual secured debt payments:</strong> Your real mortgage and car payments</li>
        <li><strong>Actual priority debt payments:</strong> Taxes owed, child support, etc.</li>
        <li><strong>Certain actual expenses:</strong> Health insurance premiums, care for elderly or disabled family members, private school tuition in some cases, and others</li>
      </ul>
      <p>
        After subtracting all allowed expenses, the result is your <strong>monthly disposable income</strong>. If this figure times 60 months is below a threshold set by the Bankruptcy Code, you still qualify for Chapter 7.
      </p>

      <div className="bp-callout">
        <p>Many people assume they fail the means test because they earn above the median. But after subtracting housing costs, car payments, health insurance, and IRS-allowed living standards, a large portion of above-median filers still qualify for Chapter 7. An attorney can run this calculation in your free consultation.</p>
      </div>

      <h2>What If You Don't Pass the Means Test?</h2>
      <p>
        Failing the means test does not mean you cannot get relief from debt — it means Chapter 7 is not available to you, and <Link to="/sheldon">Chapter 13</Link> is the appropriate path.
      </p>
      <p>
        In Chapter 13, you propose a repayment plan lasting 3 to 5 years. The plan pays your creditors a portion of what you owe — often a fraction of the total balance — based on your actual disposable income. At the end of the plan, remaining qualifying balances are discharged.
      </p>
      <p>
        Chapter 13 has real advantages: you keep all your property, you can catch up on mortgage arrears and stop foreclosure, you can reduce car loan balances through cramdown, and you have the court's protection throughout.
      </p>

      <h2>Common Means Test Misconceptions</h2>

      <h3>"If I earn anything, I'll fail."</h3>
      <p>False. The means test compares income to a median — half of all Louisiana households earn below it. Even above the median, allowed expense deductions bring most filers within qualifying range.</p>

      <h3>"The means test looks at my current income."</h3>
      <p>Not exactly. It uses a 6-month average, which can work in your favor if you recently lost a job or took a pay cut. A sudden income drop means the 6-month lookback may still reflect the higher income — but timing your filing correctly with your attorney can address this.</p>

      <h3>"If I own a business, I automatically fail."</h3>
      <p>False. Business income is included, but so are business expenses. Only net business income counts toward the means test calculation.</p>

      <h3>"I need to pass to file for bankruptcy at all."</h3>
      <p>False. The means test only applies to Chapter 7. If you do not pass, Chapter 13 remains fully available. You do not need to pass any income test to file Chapter 13.</p>

      <h2>Frequently Asked Questions</h2>
      <div className="bp-faq">
        <div className="bp-faq-item">
          <p className="bp-faq-q">What if my income varies month to month (gig work, self-employment, seasonal)?</p>
          <p className="bp-faq-a">Variable income is averaged over the 6 months before filing. If your income is currently lower than it was 6 months ago — a slow season, fewer gig hours — the average may still be elevated. Timing your filing and documenting your actual financial picture is important. An attorney can advise on the best approach.</p>
        </div>
        <div className="bp-faq-item">
          <p className="bp-faq-q">Does my spouse's income count if I file alone?</p>
          <p className="bp-faq-a">Yes and no. If you are married and file alone, your spouse's income is included in the initial median comparison — but a "marital adjustment" allows you to deduct your spouse's income that is not used for household expenses. This can significantly affect whether you qualify.</p>
        </div>
        <div className="bp-faq-item">
          <p className="bp-faq-q">Can a creditor challenge my means test calculation?</p>
          <p className="bp-faq-a">Yes. The U.S. Trustee's office reviews means test filings and can challenge cases where they believe the calculation is incorrect or expenses are inflated. Accuracy and proper documentation are essential. Your attorney will prepare the means test carefully.</p>
        </div>
        <div className="bp-faq-item">
          <p className="bp-faq-q">What if I am unemployed right now?</p>
          <p className="bp-faq-a">If you have had little or no income for the past 6 months, your CMI will likely be well below the Louisiana median, and you will pass the means test with no problem. Unemployment benefits are included in the calculation, however.</p>
        </div>
      </div>

      <div className="bp-disclaimer">
        This article is for general informational purposes only and does not constitute legal advice. Means test figures are updated periodically, and individual calculations are highly fact-specific. Contact a licensed Louisiana attorney for advice specific to your situation.
      </div>
    </BlogPost>
  );
}
